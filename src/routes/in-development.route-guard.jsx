import { Outlet } from 'react-router-dom';
import { useStatsigClient } from '@statsig/react-bindings';

export default function InDevelopmentRoute({ gateName, fallbackComponent: FallbackComponent }) {
  const { checkGate } = useStatsigClient();

  if (!gateName) {
    console.error('No feature flag name provided for development route.');
    return <FallbackComponent />;
  }

  const isEnabled = checkGate(gateName);
  return isEnabled ? <Outlet /> : <FallbackComponent />;
}
