import { Icon } from '@chakra-ui/react';

export default function GaugeBalanced({ ...props }) {
  return (
    <Icon
      width='14px'
      height='14px'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10.9598 11.9597C13.1467 9.77278 13.1467 6.22706 10.9598 4.04012C8.77286 1.85318 5.22714 1.85318 3.0402 4.04012C0.853266 6.22706 0.853266 9.77278 3.0402 11.9597'
        stroke='#1353EC'
        strokeWidth='2'
      />
      <path
        d='M7.0001 0.299904C7.7733 0.299904 8.4001 7.2267 8.4001 7.9999C8.4001 8.7731 7.7733 9.3999 7.0001 9.3999C6.2269 9.3999 5.6001 8.7731 5.6001 7.9999C5.6001 7.2267 6.2269 0.299904 7.0001 0.299904Z'
        fill='#123790'
      />
    </Icon>
  );
}
