import type { FC } from 'react';
import { ThemeSwitch } from '../../../src/component/partial/theme-switch';

// as wide as in the sidebar, "System" selected (no stored choice)
export const ThemeSwitchStory: FC = () => (
  <div className="w-[228px]">
    <ThemeSwitch />
  </div>
);
