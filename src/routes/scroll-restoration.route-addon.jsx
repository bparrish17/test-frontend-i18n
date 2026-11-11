import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRefStore } from '@store/app.store';

/**
 * temporary solution until we support proper react-router-dom ScrollRestoration
 * @see {@link https://reactrouter.com/en/main/components/scroll-restoration}
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();
  const mainRef = useRefStore((state) => state.mainRef);

  useEffect(() => {
    mainRef?.current?.scrollTo(0, 0);
  }, [pathname, mainRef]);

  return null;
}
