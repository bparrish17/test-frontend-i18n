import { Box, Divider, HStack } from '@chakra-ui/react';
import { Fragment, useMemo } from 'react';
import { uniqueId } from 'lodash-es';

export default function BulletedList({ bullets, children, ...containerProps }) {
  const listIds = useMemo(() => bullets.map(() => uniqueId()), [bullets]);

  return (
    <Box {...containerProps}>
      {bullets.map((bullet, i) => {
        const isFirst = i === 0;
        const isLast = i === bullets.length - 1;
        const lineOffset = 2;

        let connectorHeight = 'full';
        let connectTop = 0;

        if (isFirst) {
          connectTop = lineOffset;
        } else if (isLast) {
          connectorHeight = lineOffset;
        }

        return (
          <Fragment key={listIds[i]}>
            <HStack
              gap={3}
              align='flex-start'
              position='relative'
            >
              <BulletIcon />
              {children(bullet, i)}
              {bullets?.length > 1 && (
                <Divider
                  orientation='vertical'
                  position='absolute'
                  left='3px'
                  top={connectTop}
                  h={bullet.length === 1 ? 0 : connectorHeight}
                  borderLeftWidth={2}
                />
              )}
            </HStack>
          </Fragment>
        );
      })}
    </Box>
  );
}

function BulletIcon() {
  return (
    <Box
      minW={2}
      minH={2}
      mt={1.5}
      zIndex={1}
      rounded='full'
      bgColor='surface.outline'
    ></Box>
  );
}
