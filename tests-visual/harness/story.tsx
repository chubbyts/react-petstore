import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { PageErrorProvider } from '../../src/hook/use-page-error';
import { ToastProvider } from '../../src/hook/use-toast';
import { stories } from '../stories';
import '../../src/index.css';

// story.html?story=button, the theme follows the color scheme of the browser (like the app without a stored choice)
const storyName = new URLSearchParams(window.location.search).get('story') ?? '';

document.documentElement.setAttribute(
  'data-theme',
  window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
);

const Story = stories[storyName];

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MemoryRouter>
      <ToastProvider>
        <PageErrorProvider>
          <div data-testid="story" className="bg-canvas inline-block p-4">
            {Story ? <Story /> : <p>Unknown story: {storyName}</p>}
          </div>
        </PageErrorProvider>
      </ToastProvider>
    </MemoryRouter>
  </StrictMode>,
);
