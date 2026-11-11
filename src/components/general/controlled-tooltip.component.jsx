import { Tooltip, useDisclosure } from '@chakra-ui/react';

export default function ControlledTooltip({ label, children, ...props }) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <Tooltip
      isOpen={isOpen}
      label={label}
      {...props}
    >
      {children({
        cursor: 'pointer',
        onMouseEnter: onOpen,
        onMouseLeave: onClose,
        onClick: onToggle
      })}
    </Tooltip>
  );
}
