import { mapValues, some, keyBy, map } from 'lodash-es';
import { createRef, useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useArchiveCard,
  useReadCard,
  useSaveCard,
  useCards,
  useSetCardShared,
  useCardById
} from '@services/query-services/cards.query-service';
import { SFChecklistIcon, SFCalendarIcon, SFListBulletIndentIcon } from '@assets/icons';
import { useStyledToast } from '@util/hooks';

/**
 * Helper for performing shared actions on summary cards that will perform optimisticUpdates based on pages card query (or meetings query
 * in the case of the home page, agenda page, or meeting details page)
 *
 * @param {OptimisticUpdateConfig} _optimisticUpdateConfig
 * - Note: for optimisticUpdateConfig.type of ID, can omit this param since default queryKeyToUpdate for ID updates is { id }
 * - see optimisticUpdateIdQuery for implementation
 * @returns {(action, value, card, pageIndex?, cardIndex?) => void} handleCardActionClick - handler
 * @see {@link /documentation/card-structure.md}
 */
export const useCardActions = (_optimisticUpdateConfig) => {
  const optimisticUpdateConfig = { enabled: true, ..._optimisticUpdateConfig };
  const toast = useStyledToast();
  const queryClient = useQueryClient();
  const { mutate: saveCard } = useSaveCard({ optimisticUpdateConfig });
  const { mutate: archiveCard } = useArchiveCard({ optimisticUpdateConfig });
  const { mutate: shareCard } = useSetCardShared({ optimisticUpdateConfig });
  const { mutate: readCard } = useReadCard({ optimisticUpdateConfig });

  return (action, value, card, pageIndex, cardIndex) => {
    let mutationVars = { id: card.id, value, action };
    if (optimisticUpdateConfig.type === 'infinite') {
      mutationVars = { ...mutationVars, pageIndex, recordIndex: cardIndex };
    }
    if (action === 'save')
      saveCard(mutationVars, {
        onSuccess: () => {
          queryClient.invalidateQueries(['cards'], { refetchType: 'all' });
        }
      });
    else if (action === 'archive')
      archiveCard(mutationVars, {
        onSuccess: () => {
          const actionText = value ? 'Archived' : 'Unarchived';
          toast({ status: 'success', title: `Card ${actionText} Successfully` });
          queryClient.invalidateQueries(['cards'], { refetchType: 'all' });
        }
      });
    else if (action === 'read') readCard(mutationVars);
    else if (action === 'share') {
      shareCard({
        ...mutationVars,
        optimisticUpdateValue: value ? new Date() : null,
        optimisticUpdateAttribute: 'shared_at'
      });
    }
  };
};

export const useCardPageState = (cardId) => {
  const { data: card, isLoading } = useCardById(cardId);
  const sections = useMemo(() => {
    const sectionsConfig = {
      cardSummary: {
        enabled: !isLoading && !!card,
        name: 'Personal Summary',
        icon: SFChecklistIcon,
        order: 0
      },
      detailedSummary: {
        enabled: !isLoading && !!card,
        name: 'Detailed Summary',
        icon: SFListBulletIndentIcon,
        order: 1
      },
      priorCards: {
        enabled: true,
        name: `Prior ${card?.source_data?.source || ''} Digests`,
        icon: SFCalendarIcon,
        order: 2
      }
    };

    return mapValues(sectionsConfig, (section) => ({ ...section, ref: createRef() }));
  }, [card, isLoading]);

  return {
    card,
    isLoading,
    sections
  };
};

export function useFullCards(insight) {
  const { data: fullCards, isLoading } = useCards(
    {
      ids: map(insight?.cards, 'id'),
      initiative_type: 'Lens',
      pageSize: insight?.cards?.length
    },
    { select: (cards) => keyBy(cards, 'id'), enabled: insight?.cards?.length > 0 }
  );

  const [showPrivateWarning, setShowPrivateWarning] = useState(false);

  useEffect(() => {
    if (fullCards && some(fullCards, (c) => c.source_data?.sensitive)) {
      setShowPrivateWarning(true);
    }
  }, [fullCards]);

  return { fullCards, isLoading, showPrivateWarning, setShowPrivateWarning };
}
