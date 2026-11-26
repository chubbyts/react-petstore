import type { FC } from 'react';
import { ButtonStory } from './component/button.story';
import { PetFiltersFormStory } from './component/form/pet-filters-form.story';
import { IconStory } from './component/icon.story';
import { HttpErrorStory } from './component/partial/http-error.story';
import { ModelCardStory } from './component/partial/model-card.story';
import { PaginationStory } from './component/partial/pagination.story';
import { ToastStory } from './hook/use-toast.story';

// the components shown by harness/story.html?story=<name>, the pages are tested within the app (component/page)
// only states the pages don't show: the rest is covered by the page screenshots
export const stories: Record<string, FC> = {
  button: ButtonStory,
  'pet-filters-form': PetFiltersFormStory,
  icon: IconStory,
  'http-error': HttpErrorStory,
  'model-card': ModelCardStory,
  pagination: PaginationStory,
  toast: ToastStory,
};
