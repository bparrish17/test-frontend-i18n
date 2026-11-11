import { Icon } from '@chakra-ui/react';

export default function StatusErrorIcon({ ...props }) {
  return (
    <Icon
      width='20px'
      height='20px'
      viewBox='0 0 20 20'
      fill='none'
      color='critical.primary'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle
        cx='10'
        cy='10.2994'
        r='7.25'
        stroke='currentColor'
        strokeWidth='1.5'
        fill='none'
      />
      <path
        d='M7.5 7.7994L12.5 12.7994M12.5 7.7994L7.5 12.7994'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </Icon>
  );
}
