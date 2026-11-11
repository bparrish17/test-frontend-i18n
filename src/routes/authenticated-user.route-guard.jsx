import { useUserStore } from '@store/app.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { buildStatsigUser, initializeIntercom, initializePendo } from '@util/helpers';
import { GUEST_ALLOWED_ROUTES } from '@util/constants';
import { useStatsigUser } from '@statsig/react-bindings/src';
import { useEffect } from 'react';

export default function AuthenticatedUserRoutes() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated());
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  const location = useLocation();
  const { updateUserAsync } = useStatsigUser();

  useEffect(() => {
    updateUserAsync(buildStatsigUser(user));
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user && tenant) {
      initializePendo(user, tenant);
      initializeIntercom(user, tenant);
    }
  }, [user, tenant, isAuthenticated]);

  if (isAuthenticated) {
    if (user?.isGuest) {
      const isAllowedRoute = GUEST_ALLOWED_ROUTES.some(
        (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
      );

      if (!isAllowedRoute) {
        return (
          <Navigate
            to='/'
            replace
          />
        );
      }
    }

    return <Outlet />;
  } else {
    const callbackUrl = location.pathname !== '/logout' && location.pathname;
    return (
      <Navigate
        to='/login'
        state={{ callbackUrl }}
        replace
      />
    );
  }
}
