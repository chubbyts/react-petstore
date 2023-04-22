import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
