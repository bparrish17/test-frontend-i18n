import { Icon } from '@chakra-ui/react';

export default function StatusProcessingIcon({ onLabel, ...props }) {
  return (
    <Icon
      width='20px'
      height='20px'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.4435 9.9585C15.4435 6.96146 12.9508 4.47328 9.95232 4.47328V3.3335C13.5788 3.3335 16.5833 6.33053 16.5833 9.9585C16.5833 13.5794 13.5859 16.5835 9.95825 16.5835C6.33695 16.5835 3.33325 13.5798 3.33325 9.9585H4.47304C4.47304 12.9503 6.96643 15.4437 9.95825 15.4437C12.9556 15.4437 15.4435 12.9507 15.4435 9.9585Z'
        fill={onLabel ? 'white' : '#2F63D9'}
      />
    </Icon>
  );
}
