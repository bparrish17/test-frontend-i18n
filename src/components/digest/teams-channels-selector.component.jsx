import { SFExclamationMarkTriangleOutlined } from '@assets/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  CheckboxGroup,
  Divider,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import { pluralized } from '@util/helpers';

/**
 * @param {Set<string>} identifiers - Set of team IDs
 * @param {(identifiers: Set<string>) => void} onIdentifiersChange - Callback function to update identifiers
 * @param {{ [teamId: string]: string[] }} channels - Object mapping team IDs to arrays of channel IDs
 * @param {(channels: { [teamId: string]: string[] }) => void} onChannelsChange - Callback function to update channels
 */
const TeamsChannelsSelector = ({
  isInvalid,
  allTeams,
  allTeamsChannels,
  identifiers,
  onIdentifiersChange,
  channels,
  onChannelsChange,
  toSelectAllChannelsOption
}) => {
  const onCheckboxGroupChange = (teamChannels, teamId) => {
    const newChannels = channels;

    if (teamChannels?.length === 0) {
      newChannels[teamId] = [];
      identifiers.delete(teamId);
    } else {
      identifiers.add(teamId);
      if (!teamChannels?.includes(toSelectAllChannelsOption.value)) {
        newChannels[teamId] = teamChannels;
      }
    }

    onIdentifiersChange(identifiers);
    onChannelsChange(newChannels);
  };

  const toSelectAll = (teamId) => {
    const teamChannels = channels?.[teamId];
    if (!teamChannels || !teamChannels?.includes(toSelectAllChannelsOption.value)) {
      return false;
    }
    return true;
  };
  const onSelectAllCheckboxChange = (event, teamId, index) => {
    const newChannels = channels;
    if (event.target.checked) {
      const allChannelsInTeam = (allTeamsChannels[index] ?? []).map((c) => c.id);
      newChannels[teamId] = [toSelectAllChannelsOption.value, ...allChannelsInTeam];
      identifiers.add(teamId);
    } else {
      delete newChannels[teamId];
      identifiers.delete(teamId);
    }

    onIdentifiersChange(identifiers);
    onChannelsChange(newChannels);
  };

  const getSelectedInfoText = (teamId, index) => {
    if (toSelectAll(teamId)) {
      return `All (${allTeamsChannels[index]?.length})`;
    }

    const selectedChannelsCount = channels?.[teamId]?.length;

    if (!selectedChannelsCount) {
      return '';
    }

    return pluralized('channel', selectedChannelsCount);
  };

  if (allTeamsChannels?.length === 0) {
    return (
      <Text
        variant='body-500-sm'
        color='surface.onSurfaceVariant'
      >
        <SFExclamationMarkTriangleOutlined
          boxSize={4}
          mr={1}
        />
        You do not have access to any public Teams.
      </Text>
    );
  }

  return (
    <Accordion
      layerStyle='card'
      outline={isInvalid && '1px solid'}
      outlineColor={isInvalid && 'critical.primary'}
      allowMultiple
      overflow='clip'
    >
      {allTeams?.map((team, index) => (
        <AccordionItem
          key={team.id}
          _first={{ borderTop: 'none' }}
          _last={{ borderBottom: 'none' }}
        >
          <AccordionButton
            h={10}
            textStyle='body-600-md'
            color='surface.onSurfaceVariant'
          >
            <Text
              color={
                identifiers?.has(team?.id) &&
                channels?.[team.id]?.length > 0 &&
                'brandPrimary.primary'
              }
            >
              {team?.displayName}
            </Text>
            <Spacer />
            <Text>{getSelectedInfoText(team.id, index)}</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            pb={4}
            borderTop='reskin'
          >
            <CheckboxGroup
              textStyle='label-500-lg'
              value={channels?.[team.id] ?? []}
              onChange={(teamChannels) => onCheckboxGroupChange(teamChannels, team.id)}
            >
              <Stack
                layerStyle='card'
                bgColor='surface.containerLow'
                py={2}
                px={3}
              >
                <Checkbox
                  isChecked={toSelectAll(team.id)}
                  onChange={(e) => onSelectAllCheckboxChange(e, team.id, index)}
                >
                  {toSelectAllChannelsOption.label}
                </Checkbox>
                {allTeamsChannels[index]?.length > 0 && <Divider />}
                {allTeamsChannels[index]?.map((channel) => {
                  return (
                    <Checkbox
                      key={channel.id}
                      value={channel.id}
                      isDisabled={toSelectAll(team.id)}
                    >
                      <Text variant='label-500-lg'>{channel.displayName}</Text>
                    </Checkbox>
                  );
                })}
              </Stack>
            </CheckboxGroup>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TeamsChannelsSelector;
