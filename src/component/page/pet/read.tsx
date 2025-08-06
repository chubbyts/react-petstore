import type { FC } from 'react';
import { useEffect } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { H1 } from '../../heading';
import { AnchorButton } from '../../button';
import { readPetClient } from '../../../client/pet';
import type { PetResponse } from '../../../model/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn } from '../../../hook/use-query';

const pageTitle = 'Pet Read';

const Read: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const petQuery = useQuery<PetResponse, HttpError>({
    queryKey: ['pets', id],
    queryFn: provideReadQueryFn(readPetClient, id),
    retry: false,
  });

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  }, []);

  if (petQuery.isLoading) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-read">
      {petQuery.error ? <HttpErrorPartial httpError={petQuery.error} /> : null}
      <H1>{pageTitle}</H1>
      {petQuery.data ? (
        <div>
          <dl>
            <dt className="font-bold">Id</dt>
            <dd className="mb-4">{petQuery.data.id}</dd>
            <dt className="font-bold">CreatedAt</dt>
            <dd className="mb-4">
              {format(Date.parse(petQuery.data.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
            </dd>
            <dt className="font-bold">UpdatedAt</dt>
            <dd className="mb-4">
              {petQuery.data.updatedAt &&
                format(Date.parse(petQuery.data.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
            </dd>
            <dt className="font-bold">Name</dt>
            <dd className="mb-4">{petQuery.data.name}</dd>
            <dt className="font-bold">Tag</dt>
            <dd className="mb-4">{petQuery.data.tag}</dd>
            <dt className="font-bold">Vaccinations</dt>
            <dd className="mb-4">
              {petQuery.data.vaccinations.length > 0 ? (
                <ul>
                  {petQuery.data.vaccinations.map((vaccination, i) => (
                    <li key={i}>{vaccination.name}</li>
                  ))}
                </ul>
              ) : null}
            </dd>
          </dl>
        </div>
      ) : null}
      <AnchorButton to="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default Read;
