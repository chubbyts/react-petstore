import { test, expect } from 'vitest';
import { listPetsClient, createPetClient, readPetClient, updatePetClient, deletePetClient } from '../../src/client/pet';

test('pet', () => {
  expect(typeof listPetsClient).toBe('function');
  expect(typeof createPetClient).toBe('function');
  expect(typeof readPetClient).toBe('function');
  expect(typeof updatePetClient).toBe('function');
  expect(typeof deletePetClient).toBe('function');
});
