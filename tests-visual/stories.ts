import type { FC } from 'react';
import { ButtonStory } from './component/button.story';
import { CardStory } from './component/card.story';
import { DateTimeStory } from './component/date-time.story';
import { FormStory } from './component/form/form.story';
import { PetFiltersFormStory } from './component/form/pet-filters-form.story';
import { PetFormErrorsStory, PetFormStory } from './component/form/pet-form.story';
import { HeadingStory } from './component/heading.story';
import { IconStory } from './component/icon.story';
import { BackToListStory } from './component/partial/back-to-list.story';
import { DeleteDialogStory } from './component/partial/delete-dialog.story';
import { HttpErrorStory } from './component/partial/http-error.story';
import { ModelCardStory } from './component/partial/model-card.story';
import { PageErrorStory } from './component/partial/page-error.story';
import { PaginationStory } from './component/partial/pagination.story';
import { ThemeSwitchStory } from './component/partial/theme-switch.story';
import { TableStory } from './component/table.story';
import { ToastStory } from './hook/use-toast.story';

// the components shown by harness/story.html?story=<name>, the pages are tested within the app (component/page)
export const stories: Record<string, FC> = {
  button: ButtonStory,
  card: CardStory,
  'date-time': DateTimeStory,
  form: FormStory,
  'pet-filters-form': PetFiltersFormStory,
  'pet-form': PetFormStory,
  'pet-form-errors': PetFormErrorsStory,
  heading: HeadingStory,
  icon: IconStory,
  'back-to-list': BackToListStory,
  'delete-dialog': DeleteDialogStory,
  'http-error': HttpErrorStory,
  'model-card': ModelCardStory,
  'page-error': PageErrorStory,
  pagination: PaginationStory,
  'theme-switch': ThemeSwitchStory,
  table: TableStory,
  toast: ToastStory,
};
