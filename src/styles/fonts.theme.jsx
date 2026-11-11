import { Global } from '@emotion/react';

export default function Fonts() {
  return (
    <Global
      styles={`
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Air.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Air.woff') format('woff');
          font-weight: 100;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Thin.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Thin.woff') format('woff');
          font-weight: 200;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Light.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Light.woff') format('woff');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Regular.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Medium.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Medium.woff') format('woff');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Bold.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Bold.woff') format('woff');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Fono';
          src: url('/assets/fonts/AeonikFono-Black.woff2') format('woff2'),
            url('/assets/fonts/AeonikFono-Black.woff') format('woff');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Suisse Intl';
          src: url('/assets/fonts/Suisse-Intl/SuisseIntl-Regular.otf');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Suisse Intl';
          src: url('/assets/fonts/Suisse-Intl/SuisseIntl-Medium.otf');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Suisse Intl';
          src: url('/assets/fonts/Suisse-Intl/SuisseIntl-SemiBold.otf');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Suisse Intl';
          src: url('/assets/fonts/Suisse-Intl/SuisseIntl-Bold.otf');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
      `}
    />
  );
}

/*

@font-face {
          font-family: 'AeonikFono-Air';
          src: url('./assets/fonts/AeonikFono-Air.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Air.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Thin';
          src: url('./assets/fonts/AeonikFono-Thin.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Thin.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Light';
          src: url('./assets/fonts/AeonikFono-Light.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Light.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Regular';
          src: url('./assets/fonts/AeonikFono-Regular.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Medium';
          src: url('./assets/fonts/AeonikFono-Medium.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Medium.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Bold';
          src: url('./assets/fonts/AeonikFono-Bold.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Bold.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'AeonikFono-Black';
          src: url('./assets/fonts/AeonikFono-Black.woff2') format('woff2'),
            url('./assets/fonts/AeonikFono-Black.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }      
        */
