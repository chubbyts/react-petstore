import type { FC } from 'react';
import type { ThemePreference } from '../../hook/use-theme';
import { useTheme } from '../../hook/use-theme';
import { MonitorIcon, MoonIcon, SunIcon } from '../icon';

const options: Array<{ value: ThemePreference; label: string; Icon: FC<{ size?: number }> }> = [
  { value: 'system', label: 'System', Icon: MonitorIcon },
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
];

// icon with its label below: three of them fit into the sidebar
export const ThemeSwitch: FC = () => {
  const [preference, setPreference] = useTheme();

  return (
    <div role="group" aria-label="Theme" className="border-line-control flex w-full gap-0.5 rounded-lg border p-0.5">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          data-testid={`theme-${value}`}
          aria-pressed={preference === value}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium ${
            preference === value
              ? 'bg-nav-active text-link-hover forced-colors:outline forced-colors:outline-1'
              : 'text-fg-muted hover:bg-surface-hover hover:text-fg'
          }`}
          onClick={() => setPreference(value)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
};
