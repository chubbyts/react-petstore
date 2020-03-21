import InvalidParameterByNameDenormalizer from '../../Denormalizer/InvalidParameterByNameDenormalizer';
import InvalidParameter from '../../Type/Error/InvalidParameter';

test('default', () => {
    const invalidParameters: Array<InvalidParameter> = [
        { name: 'name', reason: 'wrong type', details: { key: 'value1' } },
        { name: 'name', reason: 'not empty', details: { key: 'value2' } },
        { name: 'description', reason: 'to long', details: { key: 'value3' } }
    ];

    const invalidParameterByName = InvalidParameterByNameDenormalizer(invalidParameters);

    expect(invalidParameterByName).toHaveProperty('name');
    expect(invalidParameterByName.name).toHaveLength(2);

    expect(invalidParameterByName.name[0]).toBe(invalidParameters[0]);
    expect(invalidParameterByName.name[1]).toBe(invalidParameters[1]);

    expect(invalidParameterByName).toHaveProperty('description');
    expect(invalidParameterByName.description).toHaveLength(1);

    expect(invalidParameterByName.description[0]).toBe(invalidParameters[2]);
});
