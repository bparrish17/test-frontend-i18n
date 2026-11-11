import { forEach, keyBy, reduce } from 'lodash-es';

/**
 * Converts TeamsChannelSelector result into body for ForaChannel
 * @param {{ [teamId: string]: AddedTeam }} addedTeams
 * @returns {TeamDigestMetadata}
 */
export function convertTeamSelectionsToDigest(addedTeams) {
  const identifiers = [];
  const channels = {};
  forEach(addedTeams, (addedTeam, teamId) => {
    identifiers.push(teamId);
    if (addedTeam.selectionType === 'individualChannels') {
      channels[teamId] = Array.from(addedTeam.channels);
    }
  });
  return { identifiers, channels };
}

/**
 * Checks for teams that have the selectionType of "individualChannels" but no individual channels were selected
 * @param {object[]} allTeams
 * @param {AddedTeams} addedTeams
 * @returns {string[]} - array of displayNames for the invalid teams
 * Needs allTeams so we can map the team ID to its display name since we only store id data in the addedTeams hook.
 */
export function getInvalidTeams(allTeams, addedTeams) {
  const allTeamsMap = keyBy(allTeams, 'id');
  return reduce(
    addedTeams,
    (acc, addedTeam, teamId) => {
      if (addedTeam.selectionType === 'individualChannels' && addedTeam.channels.size === 0) {
        return [...acc, allTeamsMap[teamId].displayName];
      }
      return [...acc];
    },
    []
  );
}

/**
 * Converts existing digest to selected teams configured for the TeamsChannelSelector
 * @param {TeamDigestMetadata} digest
 * @returns {AddedTeams}
 */
export function convertDigestToTeamSelections(digest) {
  const teams = digest?.identifiers;
  return teams.reduce((acc, teamId) => {
    const channels = digest.metadata?.channels[teamId];
    if (channels) {
      return {
        ...acc,
        [teamId]: { selectionType: 'individualChannels', channels: new Set(channels) }
      };
    } else {
      return { ...acc, [teamId]: { selectionType: 'allChannels', channels: new Set() } };
    }
  }, {});
}

/**
 * TeamDigestMetadata
 * @typedef {Object} TeamDigestMetadata
 * @property {string[]} identifiers - list of Team IDs
 * @property {{ [teamId: string]: string[] }} channels - list of Channel IDs key'd by their respective team
 * - if selectionType is "allChannels", channels will not be returned as that lets us assume to take all of them for the teamId
 *
 * SelectionType
 * @typedef {'allChannels' | 'individualChannels'} SelectionType
 *
 * AddedTeam
 * @typedef {Object} AddedTeam
 * @property {SelectionType} selectionType
 * @property {Set<string>} channels
 *
 * AddedTeams
 * @typedef {{ [teamId: string]: AddedTeam }} AddedTeams
 */
