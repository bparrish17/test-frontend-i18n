import { useUserStore } from '@store/app.store';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function UserTypeBlockedRoutes({ allowedTypes }) {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const isExpectedUserType = new Set(allowedTypes).has(user?.type);

  useEffect(() => {
    if (!user) return;

    if (!isExpectedUserType) {
      navigate(-1);
    }
  }, [isExpectedUserType]);

  if (isExpectedUserType) {
    return <Outlet />;
  } else {
    return null;
  }
}
