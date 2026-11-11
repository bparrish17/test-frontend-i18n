import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

/**
 * @typedef {Object} ActionPopoverStyles
 * @property {import("@chakra-ui/react").PopoverProps} popover
 * @property {import("@chakra-ui/react").PopoverArrowProps} arrow
 * @property {import("@chakra-ui/react").PopoverBodyProps} body
 * @property {import("@chakra-ui/react").PopoverContentProps} content
 */

/**
 * @typedef {Object} ActionPopoverProps
 * @property {React.ReactNode} children - The element that will trigger the popover
 * @property {number} [postActionDurationMs = 1500] - how long the popover will stay open after clicking
 * @property {number} [hoverOpenDelayMs = 500] - how long to wait before opening the popover on hover
 * @property {boolean} [isLoading = false] - how long to wait before changing preActionBody to postActionBody
 * @property {string | React.ReactNode} preActionBody - text or JSX before clicking (tooltip)
 * @property {string | React.ReactNode} postActionBody - text or JSX after clicking
 * @property {ActionPopoverStyles} [styles]
 *
 * @param {ActionPopoverProps} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ActionPopover({
  children,
  postActionDurationMs = 2500,
  hoverOpenDelayMs = 500,
  isLoading = false,
  preActionBody,
  postActionBody,
  disclosure,
  styles
}) {
  const newDisclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = disclosure || newDisclosure;

  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTime = useRef();

  useEffect(() => {
    if (isOpen && isClicked) {
      setTimeout(() => {
        onClose();
      }, postActionDurationMs);
    }
  }, [isOpen, isClicked]);

  useEffect(() => {
    if (isHovered && !isClicked) {
      hoverTime.current = setTimeout(() => {
        onOpen();
      }, hoverOpenDelayMs);
    } else if (isClicked && !isHovered) {
      clearTimeout(hoverTime.current);
      setTimeout(() => {
        setIsClicked(false);
      }, postActionDurationMs + 300);
    } else if (!isHovered) {
      clearTimeout(hoverTime.current);
      onClose();
    }
  }, [isHovered, isClicked]);

  return (
    <Popover
      placement='top'
      offset={[0, -2]}
      isOpen={isOpen}
      onOpen={onOpen}
      {...styles?.popover}
    >
      <PopoverTrigger>
        <span
          aria-hidden='true'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setIsClicked(true);
          }}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent
        w='fit-content'
        rounded='2xl'
        bgColor={isClicked ? 'legacyForaBlue' : 'surface.onSurface'}
        color='white'
        _focusVisible={{ outline: 'none' }}
        {...styles?.content}
      >
        <PopoverArrow
          boxSize='14px !important'
          left='-3px !important'
          top='-4px !important'
          bgColor={isClicked ? 'legacyForaBlue' : 'surface.onSurface'}
          boxShadow='0px !important'
          {...styles?.arrow}
        />
        <PopoverBody
          fontWeight={500}
          fontSize='sm'
          px={4}
          py={2}
          {...styles?.body}
        >
          {isLoading ? <Spinner size='xs' /> : isClicked ? postActionBody : preActionBody}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
