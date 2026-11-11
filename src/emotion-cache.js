// src/emotion-cache.js
import createCache from '@emotion/cache';

const getNonce = () => {
  const meta = document.querySelector('meta[name="csp-nonce"]');
  return meta ? meta.getAttribute('content') : null;
};

export const emotionCache = createCache({
  key: 'emotion',
  nonce: getNonce()
});

export const nonceVal = getNonce();
