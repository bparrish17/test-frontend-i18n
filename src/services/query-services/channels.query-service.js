import { useMutation, useQueryClient } from '@tanstack/react-query';
import { find, get } from 'lodash-es';
import { endOfDay } from 'date-fns';

import {
  create,
  useCreate,
  useDelete,
  useGetByIdQuery,
  usePatch,
  useSearchQuery,
  useSetAttribute
} from './default.query-service';
import {
  useFetchInitiatives,
  useCreateInitiative
} from '@services/query-services/initiatives.query-service';
import { processChannelById } from '@services/query-services/lambda.query-service';
import { COLOR_OPTIONS } from '@util/constants';

const model = 'channels';
const defaultBody = { sort: 'created_at', asc: false, pageSize: 50 };

/** @type {useSearchQuery<ChannelSearchRequest, Channel>} */
export const useChannels = useSearchQuery({ model, defaultBody });

/** @type {useGetByIdQuery<Channel>} */
export const useChannelById = useGetByIdQuery({ model });

/** @type {usePatch<Channel>} */
export const usePatchChannel = usePatch({ model });

/** @type {useCreate<Channel>} */
export const useCreateChannel = useCreate({ model });

/** @type {useSetAttribute<Channel>} */
export const useDisableChannel = useSetAttribute({ model, attribute: 'disable' });

/** @type {useDelete<Channel>} */
export const useDeleteChannel = useDelete({ model });

export const useSubscribeToEarningsCalls = (mutateOptions = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync: createFocus } = useCreateInitiative();
  const fetchInitiatives = useFetchInitiatives();

  return useMutation({
    mutationFn: async ({ tickers, fromDate }) => {
      const earningsCallFocuses = await fetchInitiatives({
        type: 'Focus',
        title: 'Earnings Calls'
      });
      let earningsCallFocus = find(earningsCallFocuses, { title: 'Earnings Calls' });
      if (!earningsCallFocus) {
        await createFocus({
          title: 'Earnings Calls',
          description:
            'Focus for summarized earnings calls from competitors and other market leaders.',
          type: 'Focus',
          color: find(COLOR_OPTIONS, { label: 'Emerald' })?.value,
          icon: 'dollar-sign',
          sensitive: false,
          visibility: 'Tenant'
        }).then((focus) => (earningsCallFocus = focus));
      }
      return subscribeToEarningsCalls(tickers, fromDate, earningsCallFocus?.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [model] });
    },
    ...mutateOptions
  });
};

export const subscribeToEarningsCalls = async (tickers, fromDate, earningsCallFocusId) => {
  const successTickers = [];
  const errorTickers = [];

  for (const ticker of tickers) {
    try {
      const channel = await create({
        model,
        body: {
          name: ticker?.companyName ? `${ticker?.companyName} (${ticker?.symbol})` : ticker?.symbol,
          source: 'Earnings_Call',
          identifiers: [ticker.symbol],
          initiative: { id: earningsCallFocusId },
          schedule: '0 2 * * *', // running every day at ~9pm EST
          next_run_at: endOfDay(new Date()).getTime(),
          last_run_status: 'pending',
          metadata: fromDate ? { from_date: fromDate } : undefined
        }
      }).catch((err) => {
        const msgs = get(err, ['response', 'data', 'errors']);
        const apiMsg = msgs?.length > 0 ? msgs[0] : null;
        let message = `An error occurred while creating subscription to "${ticker?.symbol}"`;
        if (apiMsg === 'The name is already in use by another Channel.') {
          message = `You already have a subscription to "${ticker?.symbol}"`;
        }
        throw new Error(message);
      });
      successTickers.push(ticker);
      await processChannelById(channel?.id).catch((err) =>
        console.warn(
          `failed to process new channel ${channel?.id} for ticker ${ticker?.symbol}`,
          err
        )
      );
    } catch (e) {
      errorTickers?.push({ ...ticker, message: e?.message });
    }
  }
  return { successTickers, errorTickers };
};
