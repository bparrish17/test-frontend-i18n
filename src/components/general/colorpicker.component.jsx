import { Popover, PopoverTrigger, PopoverContent, Button, Box, SimpleGrid } from '@chakra-ui/react';
import { identity, noop } from 'lodash-es';
import { ChevronDownIcon } from '@assets/icons/index.jsx';
import { FOCUS_COLORS as COLORS } from '@util/constants';

const FORA_BLUE = COLORS[7];

export default function ColorPicker({ color = FORA_BLUE, setColor, onClose = noop, buttonProps }) {
  return (
    <Popover
      placement='end-start'
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          variant='reskinWhite'
          rightIcon={<ChevronDownIcon />}
          borderRadius='xl'
          w='fit-content'
          size='lg'
          px={4}
          py={7}
          {...buttonProps}
        >
          <ColoredBox
            color={color}
            disableAnimation
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w='fit-content'
        boxShadow='xl'
      >
        <SimpleGrid
          columns={5}
          gap={4}
          p={4}
        >
          {COLORS.map((colorChoice) => {
            const isSelected = color === colorChoice;
            return (
              <ColoredBox
                key={colorChoice}
                color={colorChoice}
                setColor={setColor}
                isSelected={isSelected}
              />
            );
          })}
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  );
}

function ColoredBox({
  color = FORA_BLUE,
  setColor = identity,
  isSelected,
  disableAnimation,
  ...props
}) {
  const animationProps = disableAnimation
    ? {}
    : {
        _hover: {
          transform: 'scale(1.15)',
          boxShadow: 'lg'
        },
        cursor: 'pointer',
        transitionDuration: '150ms',
        transitionTimingFunction: 'ease-in-out',
        transitionProperty: 'transform shadow'
      };

  return (
    <Box
      bgColor={color}
      boxSize={10}
      rounded='xl'
      placeSelf='center'
      outline={isSelected && '4px solid #fff'}
      boxShadow={isSelected && 'dark-lg'}
      onClick={() => setColor(color)}
      {...animationProps}
      {...props}
    />
  );
}
