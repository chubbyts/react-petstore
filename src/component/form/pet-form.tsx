import { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import InvalidParameterByNameDenormalizer from '../../denormalizer/invalid-parameter-by-name-denormalizer';
import { PetRequest, PetResponse } from '../../model/model';
import { TextField } from './text-field';
import { HttpErrorWithInvalidParameters } from '../../api-client/error';

export type PetFormProps = {
  submitPet: { (pet: PetRequest): void };
  defaultPet?: PetResponse;
  error?: HttpErrorWithInvalidParameters;
};

export const PetForm: FC<PetFormProps> = ({ submitPet, defaultPet, error }: PetFormProps) => {
  const invalidParameterByNameDenormalized = InvalidParameterByNameDenormalizer(error ? error.invalidParameters : []);

  const { register, control, handleSubmit } = useForm<PetRequest>({ defaultValues: defaultPet });

  const vaccinations = useFieldArray({ control, name: 'vaccinations' });

  const onSubmit = (pet: PetRequest) => {
    if ('' === pet.tag) {
      pet.tag = undefined;
    }

    submitPet(pet);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <TextField
          register={register}
          name="name"
          label="Name"
          invalidParameters={invalidParameterByNameDenormalized.get('name') ?? []}
        />
        <TextField
          register={register}
          name="tag"
          label="Tag"
          invalidParameters={invalidParameterByNameDenormalized.get('tag') ?? []}
        />
        <div className="form-field">
          <label>Vaccanations</label>
          <div>
            {vaccinations.fields.map((item, i) => (
              <fieldset key={item.id}>
                <TextField
                  register={register}
                  name={`vaccinations[${i}].name`}
                  label="Name"
                  defaultValue={item.name}
                  invalidParameters={invalidParameterByNameDenormalized.get(`vaccinations[${i}].name`) ?? []}
                />
                <button
                  data-testid={`remove-vaccination-${i}`}
                  type="button"
                  onClick={() => vaccinations.remove(i)}
                  className="btn-red"
                >
                  Remove
                </button>
              </fieldset>
            ))}
            <button
              data-testid="add-vaccination"
              type="button"
              onClick={() => vaccinations.append({ name: '' })}
              className="btn-green"
            >
              Add
            </button>
          </div>
        </div>
        <button data-testid="submit-pet" className="btn-blue">
          Save
        </button>
      </fieldset>
    </form>
  );
};
