import type { FC } from 'react';
import { useEffect } from 'react';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { H1 } from '../../heading';
import { AnchorButton } from '../../button';
import { useModelResource } from '../../../hook/use-model-resource';
import { readPetClient as readClient } from '../../../client/pet';

const pageTitle = 'Pet Read';

const Read: FC = () => {
  const params = useParams();
  const id = params.id as string;

  const { model: pet, httpError, actions } = useModelResource({ readClient });

  useEffect(() => {
    document.title = pageTitle;

    actions.readModel(id);
  }, [id]);

  if (!pet && !httpError) {
    return <div></div>;
  }

  return (
    <div data-testid="page-pet-read">
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      <H1>{pageTitle}</H1>
      {pet ? (
        <div>
          <dl>
            <dt className="font-bold">Id</dt>
            <dd className="mb-4">{pet.id}</dd>
            <dt className="font-bold">CreatedAt</dt>
            <dd className="mb-4">{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</dd>
            <dt className="font-bold">UpdatedAt</dt>
            <dd className="mb-4">
              {pet.updatedAt && format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
            </dd>
            <dt className="font-bold">Name</dt>
            <dd className="mb-4">{pet.name}</dd>
            <dt className="font-bold">Tag</dt>
            <dd className="mb-4">{pet.tag}</dd>
            <dt className="font-bold">Vaccinations</dt>
            <dd className="mb-4">
              {pet.vaccinations.length > 0 ? (
                <ul>
                  {pet.vaccinations.map((vaccination, i) => (
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
