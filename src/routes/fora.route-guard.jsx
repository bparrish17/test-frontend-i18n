import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';

export default function ForaOnlyRoutes() {
  const tenant = useUserStore((state) => state.tenant);

  if (!!tenant?.id && tenant?.id !== '8cff9346-a5fe-42e6-bd20-de3731fe3bfe') {
    return (
      <Navigate
        to='/agenda'
        replace
      />
    );
  } else {
    return <Outlet />;
  }
}
