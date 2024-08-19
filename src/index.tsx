import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App.tsx';
import './index.css';
import { SettingsProvider, ImageProvider } from './settings';
import { E621Provider } from './e621';
import { VibratorProvider } from './utils';
import { StashProvider } from './stash';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ImageProvider>
        <VibratorProvider>
          <E621Provider>
            <StashProvider>
              <App />
            </StashProvider>
          </E621Provider>
        </VibratorProvider>
      </ImageProvider>
    </SettingsProvider>
  </React.StrictMode>
);
