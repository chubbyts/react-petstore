import type { FC } from 'react';
import { Button } from '../../src/component/button';
import { Card, CardBody, CardFooter, Meta } from '../../src/component/card';

export const CardStory: FC = () => (
  <div className="flex w-[640px] flex-col gap-4">
    <Card>
      <CardBody>
        <p className="m-0">Body only.</p>
      </CardBody>
    </Card>
    <Card>
      <CardBody>
        <p className="m-0">Body with a footer, meta updated.</p>
      </CardBody>
      <CardFooter>
        <Meta
          id="4d783b77-eb09-4603-b99b-f590b605ea00"
          createdAt="2026-11-01T08:14:00+00:00"
          updatedAt="2026-11-20T16:45:00+00:00"
        />
        <span className="flex-1" />
        <Button variant="primary">Edit</Button>
      </CardFooter>
    </Card>
    <Card>
      <CardBody>
        <p className="m-0">Meta never updated.</p>
      </CardBody>
      <CardFooter>
        <Meta id="4d783b77-eb09-4603-b99b-f590b605ea01" createdAt="2026-11-02T08:14:00+00:00" updatedAt={null} />
      </CardFooter>
    </Card>
  </div>
);
