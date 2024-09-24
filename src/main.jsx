// main.jsx
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { CircularProgress } from '@mui/material';

import App from './app';
import store from './utils/store';
import Loader from './loader/index';
import { AlertProvider } from './alert';
import { LoaderProvider } from './loader/contectLoader';

// // Disable right-click context menu and keyboard shortcuts for developer tools
// const disableDevTools = () => {
//   document.addEventListener('contextmenu', (e) => e.preventDefault());
//   document.addEventListener('keydown', (e) => {
//     if (
//       e.key === 'F12' ||
//       (e.ctrlKey && e.shiftKey && e.key === 'I') ||
//       (e.ctrlKey && e.shiftKey && e.key === 'J') ||
//       (e.ctrlKey && e.key === 'U')
//     ) {
//       e.preventDefault();
//     }
//   });
// };

const RootComponent = () => {
  useEffect(() => {
    // Dynamically import the network service handler to hide its presence
    (async () => {
      const { default: networkServiceHandler } = await import('./utils/networkServiceHandler');
      networkServiceHandler();
    })();
  }, []);

  return (
    <AlertProvider>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <LoaderProvider>
              <Suspense
                fallback={
                  <div className="loading-container">
                    <CircularProgress color="secondary" />
                  </div>
                }
              >
                <App />
                <Loader />
              </Suspense>
            </LoaderProvider>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </AlertProvider>
  );
};

// Call the disableDevTools function
// disableDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootComponent />);