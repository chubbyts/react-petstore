import type { FC } from 'react';
import { AnchorButton } from '../../src/component/button';
import { Breadcrumb, H1, PageHeader } from '../../src/component/heading';
import { PlusIcon } from '../../src/component/icon';

export const HeadingStory: FC = () => (
  <div className="flex w-[640px] flex-col gap-6">
    <H1>Heading level 1</H1>
    <Breadcrumb items={[{ label: 'Pets', to: '/pet' }, { label: 'Brownie', to: '/pet/4d783b77' }, { label: 'Edit' }]} />
    <PageHeader title="Title only" />
    <PageHeader
      eyebrow="Resources / Pets"
      title="With eyebrow and action"
      action={
        <AnchorButton to="/pet/create" variant="primary">
          <PlusIcon strokeWidth={2.2} />
          New pet
        </AnchorButton>
      }
    />
  </div>
);
