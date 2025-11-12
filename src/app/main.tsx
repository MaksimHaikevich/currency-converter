import App from './App.tsx';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConverterProvider } from '@/features/convert/model';

import '@/app/styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConverterProvider>
      <App />
    </ConverterProvider>
  </StrictMode>,
);
