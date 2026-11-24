import type { FC } from 'react';
import { PawIcon } from '../../../src/component/icon';
import { ModelCard } from '../../../src/component/partial/model-card';

const countLabel = (count: number) => (count === 1 ? 'pet' : 'pets');

export const ModelCardStory: FC = () => (
  <div className="grid w-[880px] grid-cols-3 gap-4">
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="With count and create."
      count={12}
      countLabel={countLabel}
      listTo="/pet"
      createTo="/pet/create"
      createLabel="New pet"
    />
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="Single, no create."
      count={1}
      countLabel={countLabel}
      listTo="/pet"
      createLabel="New pet"
    />
    <ModelCard
      icon={<PawIcon size={20} />}
      title="Pets"
      description="Count not loaded."
      countLabel={countLabel}
      listTo="/pet"
      createLabel="New pet"
    />
  </div>
);
