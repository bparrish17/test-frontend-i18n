import { capitalize, omit } from 'lodash-es';
import { useQueryClient } from '@tanstack/react-query';
import { useStyledToast } from './general.hooks';

/**
 * @typedef {Object} MutationToast
 * @property {MutationToastStatus} success
 * @property {MutationToastStatus} error
 */

/**
 * @typedef {Object} MutationToastStatus
 * @property {string} title
 * @property {string} [description]
 * @property {"info" | "warning" | "success" | "error" | "loading"} [status]
 * @property {number} [duration]
 * @property {boolean} [isClosable]
 * @property {"top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"} [position]
 * @property {any} [containerStyle]
 * @property {() => void} [callback] - custom callback to run on success or error
 * @property {"before" | "after"} [callbackOrder=after] - execute callback before or after toast
 */

/**
 * @param {string | MutationToast} mutationSubjectOrCustomObj - the subject of the mutation, e.g. "card", "meeting" or custom object - see example
 * @param {"create" | "update" | "delete"} mutationType
 * @param {{ success: () => void, error: () => void }} [callbacks] - custom callbacks on success and error
 * @param {"before" | "after"} [callbackOrder=after] - execute callback before or after toast
 * @param {{ position: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right", duration: number, isClosable: boolean, containerStyle: any, [key: string]: any }} [toastCustomOptions]
 * @returns {{ onSuccess: () => void, onError: (e: { message: string }) => void} }
 * @throws {Error} if mutationType is invalid
 * @throws {Error} if mutationSubject was not provided
 * @example
 * const { onSuccess, onError } = useMutationToast("card", "create", {success: () => navigate("/feed")})
 * // onSuccess toast title: 'Card was created successfully'
 * @example
 * const { onSuccess, onError } = useMutationToast({
 *  success: {
 *    title: `Successfully created card "${card.title}"`
 *    callback: () => navigate("/feed")
 *  },
 *  error: {
 *    title: `Failed to create card "${card.title}"`,
 *    description: `Failed after ${attemptsCount} attempts`
 *    callbackOrder: "before",
 *    callback: () => retryBeforeCommunicatingToUser()
 *  }
 * })
 * // onSuccess toast title: 'Successfully created card "Revamping Authentication"'
 */
export const useMutationToast = (
  mutationSubjectOrCustomObj,
  mutationType,
  callbacks,
  callbackOrder = 'after',
  toastCustomOptions
) => {
  const toast = useStyledToast();
  const defaultToastOptions = {
    duration: 4000,
    isClosable: true
  };

  if (typeof mutationSubjectOrCustomObj === 'object') {
    const mutationToast = mutationSubjectOrCustomObj;

    const onSuccess = getStatusCallbackFromObj(
      toast,
      'success',
      mutationToast,
      defaultToastOptions
    );

    const onError = getStatusCallbackFromObj(toast, 'error', mutationToast, defaultToastOptions);
    return { onSuccess, onError };
  }

  if (!mutationType || !['create', 'update', 'delete'].includes(mutationType)) {
    console.error(`Invalid mutationType: ${mutationType}`);
    return { onSuccess: () => null, onError: () => null };
  }

  const mutationSubject = mutationSubjectOrCustomObj;
  const mutationVerbOnSuccess = mutationType + 'd';
  const mutationVerbOnError = mutationType.slice(0, -1) + 'ing';

  const successTitle = `${capitalize(mutationSubject)} was ${mutationVerbOnSuccess} successfully`;
  const errorTitle = `Something went wrong when ${mutationVerbOnError} ${mutationSubject}`;

  const onSuccess = getStatusCallbackFromStr(
    toast,
    'success',
    successTitle,
    callbacks,
    callbackOrder,
    defaultToastOptions,
    toastCustomOptions
  );

  const onError = getStatusCallbackFromStr(
    toast,
    'error',
    errorTitle,
    callbacks,
    callbackOrder,
    defaultToastOptions,
    toastCustomOptions
  );

  return { onSuccess, onError };
};

const getStatusCallbackFromStr = (
  toast,
  status,
  title,
  callbacks = {},
  callbackOrder,
  defaultOptions,
  customOptions
) => {
  return (result) => {
    callbacks[status] && callbackOrder === 'before' && callbacks[status]?.(result);
    toast({
      title,
      status,
      description: status === 'error' ? result?.message : undefined,
      ...defaultOptions,
      ...customOptions
    });
    callbacks[status] && callbackOrder === 'after' && callbacks[status]?.(result);
  };
};

const getStatusCallbackFromObj = (toast, status, object, defaultOptions) => {
  return (result) => {
    const { callbackOrder = 'after', callback } = object[status] ?? {};
    callbackOrder === 'before' && callback?.(result);
    toast({
      status,
      description: status === 'error' ? object[status].description + result?.message : undefined,
      ...defaultOptions,
      ...omit(object[status], ['callback', 'callbackOrder'])
    });
    callbackOrder === 'after' && callback?.(result);
  };
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  /**
   * @typedef {object} InvalidateConfig
   * @property {string} model
   * @property {string | string[]} queryKey
   * @property {(queryKey) => boolean} condition
   *
   * @param {InvalidateConfig} config
   */
  const invalidate = ({ model, queryKey, condition = () => true, ...invalidateOptions }) => {
    let config = {};
    if (typeof queryKey === 'string') {
      config = { queryKey: [model, queryKey] };
    } else if (Array.isArray(queryKey)) {
      config = { queryKey: [model, ...queryKey] };
    } else {
      config = {
        predicate: (query) => query.queryKey[0] === model && condition(query.queryKey[1])
      };
    }
    return queryClient.invalidateQueries({ ...config, ...invalidateOptions });
  };

  return invalidate;
};
