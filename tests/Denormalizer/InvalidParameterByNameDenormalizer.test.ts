import InvalidParameterByNameDenormalizer from '../../src/Denormalizer/InvalidParameterByNameDenormalizer';
import InvalidParameter from '../../src/Model/Error/InvalidParameter';
import { test, expect } from 'vitest';

test('default', () => {
  const invalidParameters: Array<InvalidParameter> = [
    { name: 'name', reason: 'wrong type', details: { key: 'value1' } },
    { name: 'name', reason: 'not empty', details: { key: 'value2' } },
    { name: 'description', reason: 'to long', details: { key: 'value3' } },
  ];

  const invalidParameterByName = InvalidParameterByNameDenormalizer(invalidParameters);

  expect(invalidParameterByName.has('name')).toBeTruthy();

  const InvalidParametersOfName = invalidParameterByName.get('name');

  expect(InvalidParametersOfName).toBeInstanceOf(Array);
  expect(InvalidParametersOfName).toHaveLength(2);

  expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[0] : null).toBe(invalidParameters[0]);
  expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[1] : null).toBe(invalidParameters[1]);

  const InvalidParametersOfDescription = invalidParameterByName.get('description');

  expect(InvalidParametersOfDescription).toBeInstanceOf(Array);
  expect(InvalidParametersOfDescription).toHaveLength(1);

  expect(InvalidParametersOfDescription instanceof Array ? InvalidParametersOfDescription[0] : null).toBe(
    invalidParameters[2],
  );
});
