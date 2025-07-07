import { describe, expect, test } from 'vitest';
import type { InvalidParameter } from '../../src/client/error';
import { BadRequest, NetworkError, UnprocessableEntity, createInvalidParametersByName } from '../../src/client/error';

describe('error', () => {
  describe('createInvalidParametersByName', () => {
    test('with network error', () => {
      const invalidParametersByName = createInvalidParametersByName(new NetworkError({ title: 'network error' }));

      expect(invalidParametersByName.size).toBe(0);
    });

    test('with bad request and without invalid parameters', () => {
      const invalidParametersByName = createInvalidParametersByName(new BadRequest({ title: 'bad request' }));

      expect(invalidParametersByName.size).toBe(0);
    });

    test('with bad request and with invalid parameters', () => {
      const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'wrong type', details: { key: 'value1' } },
        { name: 'name', reason: 'not empty', details: { key: 'value2' } },
        { name: 'description', reason: 'to long', details: { key: 'value3' } },
      ];

      const invalidParametersByName = createInvalidParametersByName(
        new BadRequest({ title: 'bad request', invalidParameters }),
      );

      expect(invalidParametersByName.has('name')).toBeTruthy();

      const InvalidParametersOfName = invalidParametersByName.get('name');

      expect(InvalidParametersOfName).toBeInstanceOf(Array);
      expect(InvalidParametersOfName).toHaveLength(2);

      expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[0] : null).toBe(invalidParameters[0]);
      expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[1] : null).toBe(invalidParameters[1]);

      const InvalidParametersOfDescription = invalidParametersByName.get('description');

      expect(InvalidParametersOfDescription).toBeInstanceOf(Array);
      expect(InvalidParametersOfDescription).toHaveLength(1);

      expect(InvalidParametersOfDescription instanceof Array ? InvalidParametersOfDescription[0] : null).toBe(
        invalidParameters[2],
      );
    });

    test('with unprocessable entity and with invalid parameters', () => {
      const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'wrong type', details: { key: 'value1' } },
        { name: 'name', reason: 'not empty', details: { key: 'value2' } },
        { name: 'description', reason: 'to long', details: { key: 'value3' } },
      ];

      const invalidParametersByName = createInvalidParametersByName(
        new UnprocessableEntity({ title: 'unprocessable entity', invalidParameters }),
      );

      expect(invalidParametersByName.has('name')).toBeTruthy();

      const InvalidParametersOfName = invalidParametersByName.get('name');

      expect(InvalidParametersOfName).toBeInstanceOf(Array);
      expect(InvalidParametersOfName).toHaveLength(2);

      expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[0] : null).toBe(invalidParameters[0]);
      expect(InvalidParametersOfName instanceof Array ? InvalidParametersOfName[1] : null).toBe(invalidParameters[1]);

      const InvalidParametersOfDescription = invalidParametersByName.get('description');

      expect(InvalidParametersOfDescription).toBeInstanceOf(Array);
      expect(InvalidParametersOfDescription).toHaveLength(1);

      expect(InvalidParametersOfDescription instanceof Array ? InvalidParametersOfDescription[0] : null).toBe(
        invalidParameters[2],
      );
    });
  });
});
