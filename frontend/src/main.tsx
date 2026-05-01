import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './lib/toast-context.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
