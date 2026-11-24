import type { Page } from 'flashwright-test';
import { expect, test } from 'flashwright-test';
import type { PetResponse } from '../src/model/pet';

export const themes = ['dark', 'light'] as const;

export type Theme = (typeof themes)[number];

// defines the tests once per theme: the browser's color scheme, which the app follows without a stored choice
export const describeThemes = (callback: (theme: Theme) => void): void => {
  for (const theme of themes) {
    test.describe(theme, () => {
      test.use({ colorScheme: theme });
      callback(theme);
    });
  }
};

// the text must be drawn with the bundled fonts (harness/fonts.css): a font of the system (used for characters missing
// in them) differs between machines, the screenshots would only match on the machine that took them
const expectBundledFonts = async (page: Page): Promise<void> => {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');

  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'body *' });
  const systemFonts = new Set<string>();

  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });

    for (const font of fonts) {
      if (!font.isCustomFont) {
        systemFonts.add(font.familyName);
      }
    }
  }

  await cdp.detach();

  expect([...systemFonts], 'fonts of the system used, add the characters to harness/fonts.css').toEqual([]);
};

export type StoryOptions = {
  // the whole page instead of the story: for components rendered outside of it (portals, e.g. dialogs and toasts)
  page?: boolean;
};

// a screenshot of a story (see tests-visual/stories.ts) per theme
export const storyTest = (story: string, { page: wholePage = false }: StoryOptions = {}): void => {
  describeThemes((theme) => {
    if (wholePage) {
      test.use({ viewport: { width: 640, height: 480 } });
    }

    test(story, async ({ page }) => {
      await page.goto(`/tests-visual/harness/story.html?story=${story}`);
      await expect(page.getByTestId('story')).toBeVisible();
      await expectBundledFonts(page);

      if (wholePage) {
        await expect(page).toHaveScreenshot(`${story}-${theme}.png`);
      } else {
        await expect(page.getByTestId('story')).toHaveScreenshot(`${story}-${theme}.png`);
      }
    });
  });
};

// see .env.test
const apiUrl = 'https://petstore.test';
const oidcAuthority = 'https://keycloak.test/realms/petstore';
const oidcClientId = 'petstore-frontend';

// a signed in user as stored by oidc-client-ts (see src/oidc.ts), no identity provider needed
export const signIn = async (page: Page): Promise<void> => {
  const user = {
    access_token: 'access-token',
    token_type: 'Bearer',
    scope: 'openid profile email',
    profile: { sub: 'e4a7b1c2', preferred_username: 'jane.doe' },
    // 2100-01-01
    expires_at: 4102444800,
  };

  await page.addInitScript(
    ([key, value]) => window.sessionStorage.setItem(key, value),
    [`oidc.user:${oidcAuthority}:${oidcClientId}`, JSON.stringify(user)],
  );
};

const createPet = (
  i: number,
  name: string,
  tag: string | null,
  vaccinations: Array<string>,
  updatedAt: string | null,
): PetResponse => {
  const id = `4d783b77-eb09-4603-b99b-f590b605ea${String(i).padStart(2, '0')}`;

  return {
    id,
    createdAt: `2026-11-${String(i + 1).padStart(2, '0')}T08:14:00+00:00`,
    updatedAt,
    name,
    tag,
    vaccinations: vaccinations.map((vaccination) => ({ name: vaccination })),
    _links: {
      read: { href: `/api/pets/${id}` },
      update: { href: `/api/pets/${id}` },
      delete: { href: `/api/pets/${id}` },
    },
  };
};

export const pets: Array<PetResponse> = [
  createPet(0, 'Brownie', 'dog', ['Rabies', 'Distemper', 'Parvovirus'], '2026-11-20T16:45:00+00:00'),
  createPet(1, 'Whiskers', 'cat', ['Rabies'], null),
  createPet(2, 'Nemo', 'fish', [], null),
  createPet(3, 'Bella', 'dog', ['Rabies', 'Leptospirosis'], '2026-11-12T10:00:00+00:00'),
  createPet(4, 'Kiwi', 'bird', [], null),
  createPet(5, 'Oscar', null, [], null),
  createPet(6, 'Luna', 'cat', ['Feline leukemia'], null),
  createPet(7, 'Rocky', 'dog', ['Rabies', 'Distemper'], null),
  createPet(8, 'Coco', 'rabbit', [], '2026-11-21T07:30:00+00:00'),
  createPet(9, 'Milo', 'cat', [], null),
  createPet(10, 'Shelly', 'turtle', [], null),
  createPet(11, 'Max', 'dog', ['Rabies'], null),
];

// the api is on another origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Accept, Authorization, Content-Type',
};

// the pet endpoints with the given pets (list with paging and the name filter, read), add routes for other responses
export const mockPetApi = async (page: Page, items: Array<PetResponse> = pets): Promise<void> => {
  await page.route(`${apiUrl}/api/pets**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const id = url.pathname.match(/^\/api\/pets\/([^/]+)$/)?.[1];

    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsHeaders });
    }

    if (request.method() === 'GET' && id === undefined) {
      const offset = Number(url.searchParams.get('offset') ?? 0);
      const limit = Number(url.searchParams.get('limit') ?? 20);
      const name = url.searchParams.get('filters[name]');
      const filtered = name ? items.filter((pet) => pet.name.toLowerCase().includes(name.toLowerCase())) : items;

      return route.fulfill({
        headers: corsHeaders,
        json: {
          offset,
          limit,
          filters: name ? { name } : {},
          sort: {},
          count: filtered.length,
          items: filtered.slice(offset, offset + limit),
          _links: { create: { href: '/api/pets' } },
        },
      });
    }

    if (request.method() === 'GET') {
      const pet = items.find((item) => item.id === id);

      return pet
        ? route.fulfill({ headers: corsHeaders, json: pet })
        : route.fulfill({
            status: 404,
            headers: corsHeaders,
            json: { title: 'Not Found', detail: `There is no entry with id "${id}"`, instance: 'b5cb3e7f' },
          });
    }

    return route.fulfill({ status: 500, headers: corsHeaders, json: { title: 'Internal Server Error' } });
  });
};

// a response of the pet endpoints, overrides the mockPetApi one (the last route added is used first)
export const mockPetApiResponse = async (
  page: Page,
  method: string,
  status: number,
  json: { [key: string]: unknown },
): Promise<void> => {
  await page.route(`${apiUrl}/api/pets**`, async (route) =>
    route.request().method() === method ? route.fulfill({ status, headers: corsHeaders, json }) : route.fallback(),
  );
};

// the whole page once loaded: the elements with the given test ids are visible (e.g. the page and the pet count)
// fullPage false: only the viewport, e.g. for overlays (fixed: they cover the viewport only)
export const expectPage = async (
  page: Page,
  name: string,
  theme: Theme,
  testIds: Array<string>,
  { fullPage = true }: { fullPage?: boolean } = {},
): Promise<void> => {
  for (const testId of testIds) {
    await expect(page.getByTestId(testId)).toBeVisible();
  }

  await expectBundledFonts(page);

  // the pointer may rest on a button clicked before: no hover styles
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot(`${name}-${theme}.png`, { fullPage });
};
