import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@src/App';
import '@src/index.css';
import '@src/i18n';
import { bootstrapAxios } from '@util/helpers';
import { ColorModeScript } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { emotionCache, nonceVal } from './emotion-cache';
import { CacheProvider } from '@emotion/react';
import { ConfigProvider } from 'antd';

bootstrapAxios();

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider csp={{ nonce: nonceVal }}>
    <CacheProvider value={emotionCache}>
      <GoogleOAuthProvider clientId='844903663919-aaq2ob5euqcpp5kkhbi349302up1thjn.apps.googleusercontent.com'>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ColorModeScript initialColorMode='light' />
          <App />
        </Router>
      </GoogleOAuthProvider>
    </CacheProvider>
  </ConfigProvider>
);
