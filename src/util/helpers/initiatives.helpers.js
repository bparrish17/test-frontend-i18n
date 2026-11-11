import { AUTOMATCH_SIMILARITY_SCORE, NEVERMATCH_SIMILARITY_SCORE } from '@util/constants';
import { some } from 'lodash-es';

/**
 * This file is for helpers that are common to both Focuses and Lenses
 */

export const isUserACollaborator = (lens, user) => {
  return some(lens?.collaborators, (collaborator) => collaborator?.id === user?.id);
};

export const userHasAccessToLens = (lens, user) => {
  return isUserACollaborator(lens, user) || lens?.visibility === 'Tenant';
};

/**
 *
 * @param {number} minSimilarityScore
 * @returns {{
 *   tier: number;
 *   label: string;
 *   description: string;
 * }}
 */
export const getMinSimilarityScoreTier = (minSimilarityScore) => {
  if (minSimilarityScore === 0) {
    return {
      tier: 0,
      label: 'lowest',
      description: 'Unfocused results, very frequent updates.'
    };
  } else if (minSimilarityScore <= 25) {
    return {
      tier: 1,
      label: 'lower',
      description: 'Less focused sources, updating you more frequently.'
    };
  } else if (minSimilarityScore <= 50) {
    return {
      tier: 2,
      label: 'medium',
      description: 'A focused selection of sources with regular updates. (Recommended)'
    };
  } else if (minSimilarityScore <= 75) {
    return {
      tier: 3,
      label: 'higher',
      description: 'More focused, Lens-worthy sources, updating you less frequently.'
    };
  } else {
    return {
      tier: 4,
      label: 'highest',
      description: 'Extremely focused results with very rare updates.'
    };
  }
};

export const isCustomSummary = (initiative) => {
  if (!initiative?.tags) return false;

  return initiative.tags.includes('template');
};

export const getAutoMatchScore = (isAutoMatch) => {
  if (isAutoMatch) {
    return AUTOMATCH_SIMILARITY_SCORE;
  }

  return NEVERMATCH_SIMILARITY_SCORE;
};
