import { Icon } from '@chakra-ui/react';

export default function StatusRecordingIcon({ onLabel, ...props }) {
  return (
    <Icon
      width='20px'
      height='20px'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      color='live.primary'
      {...props}
    >
      <path
        d='M10 16.9399C6.3737 16.9399 3.35938 13.9256 3.35938 10.2993C3.35938 6.6665 6.36719 3.65869 9.99349 3.65869C13.6263 3.65869 16.6406 6.6665 16.6406 10.2993C16.6406 13.9256 13.6328 16.9399 10 16.9399ZM10.013 12.923C11.4648 12.923 12.6432 11.7446 12.6432 10.2863C12.6432 8.83447 11.4648 7.6626 10.013 7.6626C8.55469 7.6626 7.3763 8.83447 7.3763 10.2863C7.3763 11.7446 8.55469 12.923 10.013 12.923Z'
        fill={onLabel ? 'white' : 'currentColor'}
      />
    </Icon>
  );
}
