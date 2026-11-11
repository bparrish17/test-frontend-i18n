import { ChatProvider } from '@store/chat/chat.store';
import { createBaseStoreFunction } from './base-chat.store';
import {
  createInitiativeSkippingBackfill,
  generateCardTemplate,
  generateLensPrompts
} from '@services/query-services/initiatives.query-service';
import { addYears, subHours } from 'date-fns';
import { createCard } from '@services/query-services/cards.query-service';
import analyticsService from '@services/analytics.service';
/**
 * Creates the state and actions for the custom summary chat Zustand store.
 * This function extends the base chat store with custom summary-specific functionality.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the store.
 * @param {object} options.initiatorData - Initial custom summary data to bootstrap the chat store.
 * @returns {object} An object containing the state and actions for the custom summary chat store.
 */
export const createStoreFunction = (set, get, options) => ({
  ...createBaseStoreFunction(set, get, {
    chatType: 'custom-summary-chat',
    trackingEvent: 'Custom Summary Chat Response',
    errorTitle: 'Custom Summary Chat Error',
    queryKey: 'type-custom-summary',
    initiatorType: 'Custom_Summary',
    initiatorData: options?.initiatorData,
    closeFn: options.closeFn,
    expansionState: 'fullscreen'
  }),

  templateTitle: '',
  isTemplateTitleFormDirty: false,

  setTemplateTitle: (value) => {
    set({ templateTitle: value });
  },

  setTemplateTitleFormDirty: (value) => {
    set({ isTemplateTitleFormDirty: value });
  },

  getFormattingInstructions: (artifact) => {
    return `Please generate a summary that roughly aligns with the following content format: ${artifact.content}`;
  },

  saveAsTemplate: async (user) => {
    const { conversation } = get();
    const artifact = conversation?.artifacts[conversation.artifacts.length - 1];
    const formattingInstructions = get().getFormattingInstructions(artifact);
    const cardTemplateRes = await generateCardTemplate(formattingInstructions);
    const cardTemplate = JSON.parse(cardTemplateRes.value);

    const headline = artifact?.title;
    const lensPrompts = await generateLensPrompts({
      title: get().title,
      formatting_instructions: formattingInstructions
    });
    const lensConfig = {
      ...lensPrompts.data,
      min_similarity_score: 1
    };
    const templateTitle = get().title;
    const templateBody = {
      title: templateTitle,
      description: `This is a custom summary template titled ${templateTitle}`,
      type: 'Lens',
      visibility: 'Owner',
      lens_config: lensConfig,
      formatting_instructions: formattingInstructions,
      card_template: cardTemplateRes.value,
      tags: ['template'],
      creator: { id: user?.id },
      tenant: { id: user?.tenants[0]?.id },
      collaborators: [{ id: user?.id }],
      start_at: subHours(new Date(), 12).getTime(),
      end_at: addYears(new Date(), 10).getTime()
    };

    analyticsService.trackButtonClick('Custom Summary Template Save Button Clicked', {
      userId: user?.id,
      meetingId: conversation?.sources[0].id,
      num_messages: conversation?.messages?.length
    });

    let initiative;
    try {
      initiative = await createInitiativeSkippingBackfill(templateBody);
    } catch (e) {
      throw new Error(e.response.data.errors);
    }

    const cardBody = {
      headline,
      sections: cardTemplate.sections,
      person: {
        id: user.id
      },
      tenant: {
        id: user.tenants[0]?.id
      },
      initiative: {
        id: initiative.id
      },
      source: conversation.sources[0].type,
      source_data: {
        id: conversation.sources[0].id
      }
    };

    const card = await createCard(cardBody);
    return { card, initiative };
  }
});

/**
 * Provider component for the Custom Summary Chat store.
 * It utilizes the generic ChatProvider and injects the custom summary chat store logic.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @param {object} props.initiatorData - Initial custom summary data to bootstrap the chat store.
 * @returns {JSX.Element} The ChatProvider wrapping the children with the custom summary chat store.
 */
export const CustomSummaryChatProvider = ({ children, initiatorData, closeFn }) => (
  <ChatProvider
    createStoreFunction={(set, get) => createStoreFunction(set, get, { initiatorData, closeFn })}
  >
    {children}
  </ChatProvider>
);
