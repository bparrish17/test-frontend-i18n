import { describe, it, expect, vi } from 'vitest';
import { endOfDay } from 'date-fns';
import { renderHook, act } from '@testing-library/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  useCreateInitiative,
  useFetchInitiatives
} from '@services/query-services/initiatives.query-service';

import {
  useSubscribeToEarningsCalls,
  subscribeToEarningsCalls
} from '@services/query-services/channels.query-service';
import { create } from '@services/query-services/default.query-service';
import { processChannelById } from '@services/query-services/lambda.query-service';
import { fakeForaAPIError } from '@test/test.helpers';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
  useMutation: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCreateInitiative: vi.fn(),
  useFetchInitiatives: vi.fn()
}));

vi.mock('lodash', () => ({
  find: vi.fn()
}));

vi.mock('@services/query-services/default.query-service', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    create: vi.fn(),
    useSearchQuery: vi.fn()
  };
});

vi.mock(import('@services/query-services/initiatives.query-service'), async () => {
  return {
    useCreateInitiative: vi.fn(),
    useFetchInitiatives: vi.fn()
  };
});

vi.mock('@services/query-services/lambda.query-service.js', () => ({
  processChannelById: vi.fn()
}));

const tickers = [
  { symbol: 'AAPL', companyName: 'Apple, Inc.' },
  { symbol: 'GOOGL', companyName: 'Google' }
];

const fromDate = new Date();

// todo: add spies to subscribeToEarningsCalls
describe('useSubscribeToEarningsCalls', () => {
  const queryClient = {
    invalidateQueries: vi.fn()
  };

  beforeEach(() => {
    useCreateInitiative.mockReturnValue({ mutateAsync: vi.fn() });
    useQueryClient.mockReturnValue(queryClient);
    create.mockResolvedValue({ id: 'fake-channel-id' });
    processChannelById.mockResolvedValue('success');
    useMutation.mockImplementation(({ mutationFn, onSuccess }) => ({
      mutateAsync: async (variables) => {
        await mutationFn(variables);
        await onSuccess();
      }
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should check for initiatives with the title "Earnings Calls"', async () => {
    const fetchInitiatives = vi.fn().mockResolvedValue([{ title: 'Earnings Calls' }]);
    useFetchInitiatives.mockReturnValue(fetchInitiatives);

    const { result } = renderHook(() => useSubscribeToEarningsCalls());

    await act(async () => {
      await result.current.mutateAsync({ tickers, fromDate });
    });

    expect(fetchInitiatives).toHaveBeenCalledWith({
      type: 'Focus',
      title: 'Earnings Calls'
    });
  });

  it('should create a new focus with earnings calls criteria if not found', async () => {
    const createFocus = vi.fn().mockResolvedValue({ id: 'created-focus-id' });
    const fetchInitiatives = vi.fn().mockResolvedValue([]);

    useCreateInitiative.mockReturnValue({ mutateAsync: createFocus });
    useFetchInitiatives.mockReturnValue(fetchInitiatives);

    const { result } = renderHook(() => useSubscribeToEarningsCalls());

    await act(async () => {
      await result.current.mutateAsync({ tickers, fromDate });
    });

    expect(createFocus).toHaveBeenCalledWith({
      title: 'Earnings Calls',
      description: expect.any(String),
      type: 'Focus',
      color: '#099579', // emerald
      icon: 'dollar-sign',
      sensitive: false,
      visibility: 'Tenant'
    });
  });

  it('should use existing focus if found and subscribe to earnings calls', async () => {
    const createFocus = vi.fn();
    const fakeFocus = { id: 'existingFocusId', title: 'Earnings Calls' };
    const fetchInitiatives = vi.fn().mockResolvedValue([fakeFocus]);

    useCreateInitiative.mockReturnValue({ mutateAsync: createFocus });
    useFetchInitiatives.mockReturnValue(fetchInitiatives);

    const { result } = renderHook(() => useSubscribeToEarningsCalls());

    await act(async () => {
      await result.current.mutateAsync({ tickers, fromDate });
    });

    expect(createFocus).not.toHaveBeenCalled();
  });
});

describe('subscribeToEarningsCalls', () => {
  beforeEach(() => {
    create.mockResolvedValue({ id: 'fake-channel-id' });
    processChannelById.mockResolvedValue('success');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a channel for each provided ticker', async () => {
    await subscribeToEarningsCalls(tickers, fromDate, 'fake-earnings-call-focus-id');
    expect(create).toHaveBeenCalledTimes(tickers.length);
  });

  it('should invoke create with model = channels and expected body ', async () => {
    const firstTicker = tickers[0];
    const fakeFocusId = 'fake-earnings-call-focus-id';
    await subscribeToEarningsCalls(tickers.slice(0), fromDate, fakeFocusId);
    expect(create).toHaveBeenCalledWith({
      model: 'channels',
      body: expect.objectContaining({
        // name: `${firstTicker?.companyName} (${firstTicker?.symbol})`,
        source: 'Earnings_Call',
        identifiers: [firstTicker.symbol],
        initiative: { id: fakeFocusId },
        schedule: '0 2 * * *',
        next_run_at: endOfDay(new Date()).getTime(),
        last_run_status: 'pending',
        metadata: { from_date: fromDate }
      })
    });
  });

  it('should create channel with combo companyName and symbol name if companyName exists', async () => {
    const firstTicker = tickers[0];
    const fakeFocusId = 'fake-earnings-call-focus-id';
    await subscribeToEarningsCalls(tickers.slice(0, 1), fromDate, fakeFocusId);
    expect(create).toHaveBeenCalledWith({
      model: 'channels',
      body: expect.objectContaining({
        name: `${firstTicker?.companyName} (${firstTicker?.symbol})`
      })
    });
  });

  it("should create channel with just the ticker symbol if companyName doesn't exist", async () => {
    const fakeTicker = { symbol: 'TM', companyName: null };
    const fakeFocusId = 'fake-earnings-call-focus-id';
    await subscribeToEarningsCalls([fakeTicker], fromDate, fakeFocusId);
    expect(create).toHaveBeenCalledWith({
      model: 'channels',
      body: expect.objectContaining({
        name: fakeTicker.symbol
      })
    });
  });

  it('should create channel no metadata if fromDate not provided', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    await subscribeToEarningsCalls(tickers.slice(0, 1), null, fakeFocusId);
    expect(create).toHaveBeenCalledWith({
      model: 'channels',
      body: expect.not.objectContaining({
        metadata: expect.anything()
      })
    });
  });

  it('should process a channel for each ticker', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(processChannelById).toHaveBeenCalledTimes(tickers.length);
  });

  it('should return successful and failure tickers', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    const result = await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(result).toEqual({ successTickers: expect.any(Array), errorTickers: expect.any(Array) });
  });

  it('should add tickers to errorTickers if create channel fails', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    create.mockImplementation((req) =>
      req.body.identifiers[0] === tickers[0].symbol
        ? Promise.resolve(req)
        : Promise.reject('fake error')
    );
    const result = await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(result).toEqual({
      successTickers: [tickers[0]],
      errorTickers: [expect.objectContaining(tickers[1])]
    });
  });

  it('should add user-friendly message to errorTicker if create channel fails due to duplicate ticker', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    create.mockImplementation((req) =>
      req.body.identifiers[0] === tickers[0].symbol
        ? Promise.resolve(req)
        : Promise.reject(fakeForaAPIError('The name is already in use by another Channel.'))
    );
    const result = await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(result).toEqual({
      successTickers: [tickers[0]],
      errorTickers: [
        { ...tickers[1], message: `You already have a subscription to "${tickers[1]?.symbol}"` }
      ]
    });
  });

  it('should add tickers to successTickers if processChannelById succeeded', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    const result = await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(result).toEqual({ successTickers: tickers, errorTickers: [] });
  });

  it('should not add tickers to errorTickers if processChannelById fails', async () => {
    const fakeFocusId = 'fake-earnings-call-focus-id';
    create.mockImplementation((req) =>
      Promise.resolve(
        // fake fail the second ticker
        req.body.identifiers[0] === tickers[0].symbol
          ? { id: 'fake-channel-id-0' }
          : { id: 'fake-channel-id-1' }
      )
    );
    processChannelById.mockImplementation((id) =>
      id === 'fake-channel-id-1'
        ? Promise.reject(new Error('failed!'))
        : Promise.resolve('success!!')
    );
    const result = await subscribeToEarningsCalls(tickers, fromDate, fakeFocusId);
    expect(result).toEqual({ successTickers: tickers, errorTickers: [] });
  });
});
