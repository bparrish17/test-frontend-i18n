import { Flex, Icon, ListItem, Stack, Text, UnorderedList } from '@chakra-ui/react';
import { SFBoltFillIcon } from '@assets/icons';
import Markdown from '@components/general/markdown.component';

const ReskinCardBodyBulletPoints = ({ card, showBulletPoints }) => {
  return card?.sections?.map((section, index) => {
    const bulletPoints = section?.content?.split('* ')?.slice(1) ?? [];
    const firstPoint = section?.content?.split('* ')[1];

    return (
      <Flex
        key={section?.title}
        gap={2}
        data-testid={`bullet-points-section-${index}`}
      >
        <Icon
          as={SFBoltFillIcon}
          color='brandPrimary.primary'
          boxSize='18px'
          mt={0.5}
        />
        <Stack
          gap={0.5}
          fontSize='sm'
          data-testid={`bullet-points-container-${index}`}
        >
          <Text
            variant='aeonik'
            color='brandPrimary.primary'
            fontWeight={500}
          >
            {section?.title}
          </Text>
          {showBulletPoints ? (
            <UnorderedList
              color='surface.onSurfaceVariant'
              fontWeight={400}
              fontSize='sm'
              pl={10}
              ml={1}
            >
              {bulletPoints?.map((item) => (
                <ListItem
                  key={item}
                  sx={{ '&:not(:last-child)': { paddingBottom: '1px' } }}
                >
                  <Markdown>{item.replace('\\n', '')}</Markdown>
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <Text color='surface.onSurfaceVariant'>
              <Markdown>{firstPoint}</Markdown>
            </Text>
          )}
        </Stack>
      </Flex>
    );
  });
};

export default ReskinCardBodyBulletPoints;
