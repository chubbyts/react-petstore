import type { FC } from 'react';
import type { ButtonSize, ButtonVariant } from '../../src/component/button';
import { AnchorButton, Button } from '../../src/component/button';
import { PencilIcon, TrashIcon } from '../../src/component/icon';

const variants: Array<ButtonVariant> = ['primary', 'secondary', 'danger', 'danger-outline', 'ghost', 'ghost-danger'];
const sizes: Array<ButtonSize> = ['sm', 'md', 'lg'];

export const ButtonStory: FC = () => (
  <div className="flex flex-col gap-4">
    {sizes.map((size) => (
      <div key={size} className="flex items-center gap-2">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} size={size}>
            {variant}
          </Button>
        ))}
        <Button variant="primary" size={size} disabled>
          disabled
        </Button>
        <Button variant="icon" size={size} aria-label="Edit">
          <PencilIcon />
        </Button>
        <Button variant="icon-danger" size={size} aria-label="Delete">
          <TrashIcon />
        </Button>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <AnchorButton to="/pet" variant="primary">
        anchor primary
      </AnchorButton>
      <AnchorButton to="/pet" variant="secondary">
        anchor secondary
      </AnchorButton>
      <Button variant="ghost" size="sm">
        <PencilIcon />
        with icon
      </Button>
    </div>
  </div>
);
