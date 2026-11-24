import type { FC } from 'react';
import {
  ArrowLeftIcon,
  EyeIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PawIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  TrashIcon,
} from '../../src/component/icon';

const icons = [
  PawIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  LogOutIcon,
];

export const IconStory: FC = () => (
  <div className="flex flex-col gap-4">
    {[16, 24, 32].map((size) => (
      <div key={size} className="flex gap-4">
        {icons.map((Icon, i) => (
          <Icon key={i} size={size} />
        ))}
      </div>
    ))}
    <div className="text-link flex gap-4">
      {icons.map((Icon, i) => (
        <Icon key={i} size={24} strokeWidth={1} />
      ))}
    </div>
  </div>
);
