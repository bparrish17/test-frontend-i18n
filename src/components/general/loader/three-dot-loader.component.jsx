import { Spinner } from '@chakra-ui/react';
import './three-dot-loader.component.css';

export default function ThreeDotLoader() {
  return (
    <div className='three-dot-loader'>
      <Spinner
        size='xs'
        speed='0.8s'
        color='#C8D6E4'
      />
      <span className='dots' />
      <span className='dots' />
      <span className='dots' />
    </div>
  );
}
