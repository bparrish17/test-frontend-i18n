import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';

import { useStyledToast } from '@util/hooks';
import { useArchiveInitiative } from '@services/query-services/initiatives.query-service';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';

/**
 * Hook for managing lens activation state (archiving/unarchiving initiatives).
 * It provides functions to deactivate (archive) and reactivate (unarchive) a lens (initiative),
 * handling API calls, optimistic updates, error reporting, and user feedback via toasts.
 * @param {Object} [options={}] - Configuration options.
 * @param {Object} [options.optimisticUpdateConfig] - Config for optimistic updates passed to `useArchiveInitiative`.
 * @param {Function} [options.onSuccess] - (Not directly used by this hook, but can be part of options for `useArchiveInitiative` if extended).
 * @param {Function} [options.onError] - (Not directly used by this hook, but can be part of options for `useArchiveInitiative` if extended).
 * @returns {Object} An object containing:
 *  - `disclosure`: Chakra UI disclosure object for controlling related UI (e.g., a confirmation modal).
 *  - `deactivateLens`: Function to deactivate (archive) a lens by its ID.
 *  - `reactivateLens`: Function to reactivate (unarchive) a lens by its ID.
 *  - `isLoading`: Boolean indicating if the archive/unarchive mutation is in progress.
 */
export const useLensActivation = (options = {}) => {
  const disclosure = useDisclosure();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const rollbar = useRollbar();

  const { mutateAsync: archiveLens, isLoading } = useArchiveInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id', ...options?.optimisticUpdateConfig }
  });

  /**
   * Handles errors that occur during lens activation/deactivation.
   * Reports the error to Rollbar and displays an error toast.
   * @param {Error} error - The error object.
   * @param {'archiving'|'reactivating'} action - The action being performed when the error occurred.
   * @param {string} lensId - The ID of the lens involved in the failed action.
   */
  const handleError = (error, action, lensId) => {
    rollbar?.error(formatRollbarTitle('Lens Activation', `${action} Error`), error, { lensId });
    toast({
      title: `Error ${action} lens`,
      status: 'error',
      duration: 9000,
      isClosable: true
    });
  };

  /**
   * Handles successful lens activation/deactivation.
   * Navigates to the lenses page and displays a success toast.
   * @param {'archived'|'reactivated'} action - The action that was successfully completed.
   */
  const handleSuccess = (action) => {
    navigate('/lenses');
    toast({
      title: `Lens ${action} successfully`,
      status: 'success',
      duration: 9000,
      isClosable: true
    });
  };

  /**
   * Deactivates (archives) a lens.
   * Calls the `archiveLens` mutation with `value: true`.
   * Handles success and error cases using `handleSuccess` and `handleError`.
   * Closes the associated disclosure (e.g., modal) on completion.
   * @param {string} lensId - The ID of the lens to deactivate.
   * @async
   */
  const deactivateLens = async (lensId) => {
    await archiveLens(
      { id: lensId, value: true },
      {
        onSuccess: () => handleSuccess('archived'),
        onError: (error) => handleError(error, 'archiving', lensId)
      }
    );
    disclosure.onClose();
  };

  /**
   * Reactivates (unarchives) a lens.
   * Calls the `archiveLens` mutation with `value: false`.
   * Handles success and error cases using `handleSuccess` and `handleError`.
   * Closes the associated disclosure (e.g., modal) on completion.
   * @param {string} lensId - The ID of the lens to reactivate.
   * @async
   */
  const reactivateLens = async (lensId) => {
    await archiveLens(
      { id: lensId, value: false },
      {
        onSuccess: () => handleSuccess('reactivated'),
        onError: (error) => handleError(error, 'reactivating', lensId)
      }
    );
    disclosure.onClose();
  };

  return {
    disclosure,
    deactivateLens,
    reactivateLens,
    isLoading
  };
};
