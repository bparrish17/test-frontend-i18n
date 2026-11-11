import { useUserStore } from '@store/app.store';
import { Outlet, Navigate } from 'react-router-dom';

export default function ReadOnlyBlockedRoutes() {
  const user = useUserStore((state) => state.user);
  const isReadOnly = user?.type === 'Associate';
  if (isReadOnly) {
    return <Navigate to='/' />;
  } else {
    return <Outlet />;
  }
}
