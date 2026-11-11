import { Icon } from '@chakra-ui/react';

export default function StatusDidNotAttendIcon({ ...props }) {
  return (
    <Icon
      width='20px'
      height='20px'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipPath='url(#clip0_11043_67171)'>
        <path
          d='M6.875 10.625L8.75 12.5L13.125 8.125'
          stroke='#8593A7'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z'
          stroke='#8593A7'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_11043_67171'>
          <rect
            width='20'
            height='20'
            rx='10'
            fill='white'
          />
        </clipPath>
      </defs>
    </Icon>
  );
}
