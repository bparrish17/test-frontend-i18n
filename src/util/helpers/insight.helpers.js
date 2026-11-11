import { findIndex, keyBy, map } from 'lodash-es';
import { getAllStartIndicesOfCharacter } from '@util/helpers';
import { useMemo } from 'react';

// create map of start + end indices for footnotes, create list of which cards are sources
// then replace that footnote ID with the corresponding index for where that card is in the source list
// this takes "...this is content from a lens. [<uuid>][<uuid2>]" to "...this is content from a lens. [1][2]"
export const footnoteFormatterQuerySelector = (insight) => {
  const sources = [];

  const formatFootnotes = (sectionContent, cards) => {
    let result = sectionContent.slice();
    const startIndices = getAllStartIndicesOfCharacter('[', sectionContent);
    // UUIDs are always 36 characters in length
    const indices = startIndices.map((startIndex) => [startIndex, startIndex + 37]);
    const cardMap = keyBy(cards, 'id');

    for (const indexPair of indices) {
      const strToMatch = sectionContent.substring(indexPair[0], indexPair[1] + 1);
      const uuidToMatch = strToMatch.slice(1, -1);
      const card = cardMap[uuidToMatch];
      const sourceIndex = findIndex(sources, { id: uuidToMatch });
      if (sourceIndex < 0) {
        sources.push(card);
      }
      const updatedSourceIndex = findIndex(sources, { id: uuidToMatch });

      // using an escaped backtick here creates a "<code>" markdown item in the string
      // then we can target this with Markdown and replace with JSX
      result = result.replace(strToMatch, `\`${updatedSourceIndex + 1}\` `);
    }

    return result;
  };

  const sectionsWithFootnotes = insight?.sections?.map((section) => ({
    ...section,
    content: formatFootnotes(section.content, insight.cards)
  }));

  const sourceIds = new Set(sources?.map((s) => s?.id));
  const references = insight?.cards?.filter((card) => !sourceIds.has(card?.id));

  return {
    ...insight,
    sections: sectionsWithFootnotes,
    sources,
    references
  };
};

export function removeFootnotesFromInsightSection(str) {
  return str.replace(/\[([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\]/g, '');
}

// Custom hook to get all source and reference cards in order
export const useSourceAndReferenceCards = (insight, fullCards) => {
  return useMemo(() => {
    if (!insight) return [];

    const sourceIds = map(insight?.sources, 'id');
    const referenceIds = map(insight?.references, 'id');

    // Concatenate the IDs
    const allIds = [...sourceIds, ...referenceIds];

    // Get the full cards in the same order as the IDs
    return allIds.map((id) => fullCards?.[id]).filter(Boolean);
  }, [insight, fullCards]);
};
