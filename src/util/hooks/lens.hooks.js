/* eslint-disable camelcase */
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createRef, useMemo } from 'react';
import { filter, mapValues } from 'lodash-es';

import { usePersonById } from '@services/query-services/people.query-service';
import {
  getLensPromptSuggestion,
  useCreateInitiative,
  useInitiatives,
  usePatchInitiative
} from '@services/query-services/initiatives.query-service';
import { generateLensCardPreview } from '@services/query-services/cards.query-service';
import { useInfiniteInsights } from '@services/query-services/insights.query-service';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import {
  lensIsUsingDefaultTimestamps,
  prepareDataForSubmission,
  patchLensData,
  convertSubSourceParamsToFormData
} from '@util/helpers';
import { SIMILARITY_SCORE_TIER_MAP, SUB_SOURCE_FORM_VALUES } from '@util/constants';
import { FilterIcon, SFNoteTextIcon, SFSliderHorizontalIcon, SFGearIcon } from '@assets/icons';

/**
 * Custom hook to handle fetching infinite previous insights
 * @param {Insight} insight - The current insight object
 */
export function useInfinitePreviousInsights(insight) {
  const user = useUserStore((state) => state.user);

  const {
    data: previousInsightsRes,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSuccess
  } = useInfiniteInsights(
    {
      initiative_id: insight?.initiative?.id,
      updated_at_to: insight?.updated_at - 1,
      sort: 'updated_at',
      pageSize: 10,
      person_id: user?.id,
      has_archived_at: true
    },
    { enabled: !!insight }
  );

  const noResults = isSuccess && previousInsightsRes?.pages[0]?.total === 0;

  return {
    previousInsightsRes,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSuccess,
    noResults
  };
}

export function useAllPreviousInsights(insight) {
  const user = useUserStore((state) => state.user);

  const {
    data: previousInsightsRes,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSuccess
  } = useInfiniteInsights(
    {
      not_initiative_ids: [insight?.initiative?.id],
      sort: 'updated_at',
      pageSize: 5,
      person_id: user?.id,
      has_archived_at: true
    },
    { enabled: !!insight }
  );

  const noResults = isSuccess && previousInsightsRes?.pages[0]?.total === 0;

  return {
    previousInsightsRes,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSuccess,
    noResults
  };
}

export const getInitialValues = (template, isEdit, initialLabels) => {
  if (template) {
    const isDefaultDate = lensIsUsingDefaultTimestamps(template);

    const initialMinSimilarityScore =
      SIMILARITY_SCORE_TIER_MAP[template.lens_config.min_similarity_score] ?? 50;
    if (isEdit) {
      const values = {
        ...template,
        lens_config: {
          ...template?.lens_config,
          min_similarity_score: initialMinSimilarityScore
        },
        filters: {
          people: {
            external: template?.lens_config?.card_filter?.query?.split(',') || []
          },
          date: {
            enabled: !isDefaultDate
          },
          focus: template?.lens_config?.card_filter?.initiative_ids || [],
          participants_domains:
            template?.lens_config?.card_filter?.participants_domains?.map((d) => d.split('@')[1]) ||
            [],
          labels: initialLabels ?? [],
          sub_sources: convertSubSourceParamsToFormData(
            template?.lens_config?.card_filter?.sub_sources,
            template?.lens_config?.include_earnings_call
          )
        }
      };

      if (!isDefaultDate) {
        values.filters.date.start_at_from = template?.start_at;
        values.filters.date.start_at_to = template?.end_at;
      }

      return { values };
    } else {
      return {
        defaultValues: {
          title: template.title,
          visibility: 'Collaborators',
          color: '#2563EB',
          icon: 'lens',
          filters: {
            date: {
              enabled: false
            },
            sub_sources: filter(SUB_SOURCE_FORM_VALUES, (ss) => ss !== 'Earnings_Call')
          },
          lens_config: {
            ...template?.lens_config,
            min_similarity_score: initialMinSimilarityScore
          },
          insight_config: {
            duration_days: 7
          }
        }
      };
    }
  }
};

/**
 * Custom hook to handle lens creation form state and submission
 * @param {Object} template - Template to use for initial values
 * @param {boolean} isEdit - Whether this is an edit form
 * @returns {Object} - Form state and submission handlers
 */
export const useCreateLensFormState = (template, isEdit) => {
  const user = useUserStore((state) => state.user);
  const isViewOnlyMode = isEdit && template?.creator?.id !== user?.id;
  const { data: creator } = usePersonById(template?.creator?.id, {
    enabled: isViewOnlyMode // for showing the user who to reach out to about editing
  });
  const navigate = useNavigate();
  const { mutateAsync: createLens, isLoading: isCreating } = useCreateInitiative();

  const { mutateAsync: patchLens, isLoading: isPatching } = usePatchInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id' }
  });

  // todo: update focuses to use this same pattern too so we don't have to manipulate custom select granularly
  const labelIds = template?.lens_config?.card_filter?.label_ids;
  const { data: initialLabels } = useInitiatives(
    {
      ids: labelIds
    },
    { enabled: labelIds?.length > 0 }
  );

  const toast = useStyledToast();
  const { register, handleSubmit, setValue, getValues, formState, watch, control } = useForm({
    ...getInitialValues(template, isEdit, initialLabels),
    disabled: isViewOnlyMode
  });

  const submit = async (formData) => {
    await createLens(prepareDataForSubmission(formData, user), {
      onSuccess: (createdLens) => {
        navigate('/lenses', {
          state: {
            isLensCreated: true,
            lens: createdLens
          }
        });
      },
      onError: (e) => {
        console.log('error!');
        console.log(e);
        toast({
          title: 'Error saving lens',
          description: `${e.response.data.errors}`,
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    });
  };

  const patch = async (formData) => {
    const body = patchLensData(formData);

    return patchLens(body, {
      onError: (e) => {
        console.log('error!');
        console.log(e);
        toast({
          title: 'Error saving lens',
          description: `${e.response.data.errors}`,
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      }
    }).then((updatedLens) => {
      toast({
        title: 'Update Successful.',
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      return updatedLens;
    });
  };

  const sections = useMemo(() => {
    const sectionsConfig = {
      settings: {
        name: 'Lens Settings',
        icon: SFGearIcon,
        order: 1
      },
      description: {
        name: 'Lens Description',
        icon: SFNoteTextIcon,
        order: 2
      },
      filtering: {
        name: 'Lens Filtering',
        icon: FilterIcon,
        order: 3
      },
      advanced: {
        name: 'Advanced Settings',
        icon: SFSliderHorizontalIcon,
        order: 4
      }
    };

    return mapValues(sectionsConfig, (section) => ({ ...section, ref: createRef() }));
  }, []);

  // likely replaced when / if we have a dedicated endpoint that actually leverages prompts as part of this...
  const generateSourcesPreview = async () => {
    const formData = getValues();
    const data = prepareDataForSubmission(formData, user);
    data.type = 'Lens';
    return generateLensCardPreview(data);
  };

  const getSuggestion = async (setSuggestion, setSuggestionLoading) => {
    setSuggestionLoading(true);
    const values = getValues('lens_config');
    if (values.min_similarity_score > 1) {
      values.min_similarity_score = SIMILARITY_SCORE_TIER_MAP[values.min_similarity_score];
    }
    const { value, needed } = await getLensPromptSuggestion(values);
    if (needed) {
      setSuggestion(value);
    } else {
      setSuggestion('Looks good!');
    }
    setSuggestionLoading(false);
  };

  return {
    control,
    sections,
    submit,
    register,
    handleSubmit,
    isSubmitting: isCreating || isPatching,
    setValue,
    getValues,
    formState,
    watch,
    generateSourcesPreview,
    getSuggestion,
    patch,
    isViewOnlyMode,
    creator
  };
};
