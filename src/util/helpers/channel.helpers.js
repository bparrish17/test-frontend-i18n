import { keys, map, set } from 'lodash-es';
import { BACKEND_ID_TO_IANA_MAP } from '@util/constants';
import { formatCadenceToCron, formatCronToCadence, getNextRunAt } from '@util/helpers';

/**
 * @typedef {Object} DigestFormValues
 * @property {string} name
 * @property {'daily' | 'weekly' | 'monthly'} cadenceInterval
 * @property {{ value: string; label: string }} initiative
 * @property {Set<string>=} identifiers
 * @property {{ channels: object }=} metadata
 */

export const convertFormValuesToChannel = (formValues, timezone) => {
  const { cadenceInterval, identifiers, initiative, name } = formValues;
  const formattedTz = BACKEND_ID_TO_IANA_MAP[timezone];

  return {
    name,
    identifiers: map(identifiers, 'id'),
    initiative: { id: initiative?.value },
    schedule: formatCadenceToCron(cadenceInterval, formattedTz),
    next_run_at: getNextRunAt(cadenceInterval, formattedTz).getTime()
  };
};

export const convertTeamsFormValuesToChannel = (_formValues, isEdit, timezone) => {
  const { identifiers, metadata, ...formValues } = _formValues;
  // handle 'allChannels' option
  for (const key of Object.keys(metadata.channels)) {
    if (metadata.channels[key]?.includes('allChannels')) {
      // need to explicitly remove on edit, since undefined will retain original value if set
      if (isEdit) {
        metadata.channels[key] = null;
      } else {
        delete metadata.channels[key];
      }
    }
  }

  return {
    ...convertFormValuesToChannel(formValues, timezone),
    identifiers: [...identifiers],
    metadata
  };
};

/**
 * @param {Channel} channel
 * @returns {DigestFormValues}
 */
export const convertChannelToFormValues = (channel) => {
  return {
    name: channel.name,
    cadenceInterval: formatCronToCadence(channel.schedule),
    initiative: { value: channel.initiative?.id, label: channel?.initiative?.title }
  };
};

/**
 * @param {Channel} channel
 * @returns {DigestFormValues}
 */
export const convertTeamsChannelToFormValues = (channel) => {
  const { metadata, identifiers } = channel;

  const formMetadata = channel.metadata;
  const metadataIdentifierSet = new Set(keys(metadata?.channels));
  identifiers.forEach((identifier) => {
    if (!metadataIdentifierSet.has(identifier)) {
      set(formMetadata, ['channels', identifier], ['allChannels']);
    }
  });

  return {
    ...convertChannelToFormValues(channel),
    identifiers: new Set(channel.identifiers),
    metadata: formMetadata
  };
};
