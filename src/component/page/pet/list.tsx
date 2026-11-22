import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import { z } from 'zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loading } from '../../partial/loading';
import { DeleteDialog } from '../../partial/delete-dialog';
import { Pagination } from '../../partial/pagination';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { PageHeader } from '../../heading';
import { AnchorButton, Button } from '../../button';
import { Card } from '../../card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '../../icon';
import { numberSchema } from '../../../model/model';
import type { PetListRequest, PetSort, PetFilters, PetResponse, PetListResponse } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideDeleteMutationFn, provideListQueryFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { DateTime } from '../../date-time';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Pets';

const limit = 10;

const visibleVaccinations = 2;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

// Default → Name A–Z → Name Z–A → Default
const nextSortName = (name: PetSort['name']): PetSort['name'] => {
  if (name === 'asc') {
    return 'desc';
  }

  if (name === 'desc') {
    return undefined;
  }

  return 'asc';
};

const List: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => querySchema.parse(qs.parse(location.search.substring(1))), [location]);
  const queryClient = useQueryClient();
  const showToast = useToast();

  const [petToDelete, setPetToDelete] = useState<PetResponse | undefined>(undefined);

  // a delete finishing late (dialog cancelled meanwhile) must not close the dialog opened for another pet
  const closeDeleteDialogOf = (pet: PetResponse): void => {
    setPetToDelete((current) => (current?.id === pet.id ? undefined : current));
  };

  const petListRequest: PetListRequest = useMemo(
    () => ({
      offset: query.page * limit - limit,
      limit,
      filters: query.filters,
      sort: query.sort,
    }),
    [query.filters, query.page, query.sort],
  );

  const queryKey = useMemo(() => ['pets', qs.stringify(petListRequest)], [petListRequest]);

  const petListQuery = useQuery<PetListResponse, HttpError>({
    queryKey,
    queryFn: provideListQueryFn(listPetsClient, petListRequest),
    // keep showing the current page while the next one loads: no flicker and the pagination keeps the focus
    placeholderData: keepPreviousData,
    retry: false,
  });

  const petDeleteMutation = useMutation<unknown, HttpError, PetResponse>({
    mutationFn: (pet: PetResponse) => provideDeleteMutationFn(deletePetClient)(pet.id),
    // closes the dialog once the list is refetched: the row (and its delete button) is gone by then,
    // so the dialog moves the focus to the main content instead of an element about to be removed
    onSuccess: async (_, pet) => {
      await queryClient.invalidateQueries({ queryKey: ['pets'] });
      closeDeleteDialogOf(pet);
      showToast(`Deleted “${pet.name}” — 204 No Content`);
    },
    onError: (_, pet) => {
      closeDeleteDialogOf(pet);
    },
    retry: false,
  });

  // refining a filter (e.g. "re" → "rex" while typing) replaces the history entry: back returns to the list
  // before the filtering, not keystroke by keystroke
  const submitPetFilters = (filters: PetFilters): void => {
    void navigate(`/pet?${qs.stringify({ ...query, page: 1, filters })}`, {
      replace: Boolean(query.filters.name && filters.name),
    });
  };

  const submitPetSort = (sort: PetSort): void => {
    void navigate(`/pet?${qs.stringify({ ...query, page: 1, sort })}`);
  };

  const toggleSort = (): void => {
    submitPetSort({ ...query.sort, name: nextSortName(query.sort.name) });
  };

  // past the last page (e.g. its last pet got deleted, or an outdated link): go to the last page
  // not from placeholder data: that's the response of another query (e.g. other filters, after back)
  // the limit of the response: the server may cap the requested one, like the pagination does
  const lastPage =
    petListQuery.data && !petListQuery.isPlaceholderData
      ? Math.max(1, Math.ceil(petListQuery.data.count / petListQuery.data.limit))
      : undefined;

  useEffect(() => {
    if (lastPage !== undefined && query.page > lastPage) {
      void navigate(`/pet?${qs.stringify({ ...query, page: lastPage })}`, { replace: true });
    }
  }, [lastPage, navigate, query]);

  useDocumentTitle(pageTitle);
  usePageError(petDeleteMutation.error ?? petListQuery.error, { focus: Boolean(petDeleteMutation.error) });

  if (petListQuery.isLoading) {
    return <Loading />;
  }

  const data = petListQuery.data;

  // a page past the end (also as placeholder while the last page loads) has nothing to show: no bogus range
  const isPastEnd = data !== undefined && data.count > 0 && data.offset >= data.count;

  return (
    <div data-testid="page-pet-list" className="flex flex-col gap-[22px]">
      <PageHeader
        eyebrow="Resources / Pets"
        title={pageTitle}
        action={
          data?._links?.create ? (
            <AnchorButton data-testid="pet-create" to="/pet/create" variant="primary">
              <PlusIcon strokeWidth={2.2} />
              New pet
            </AnchorButton>
          ) : null
        }
      />
      <Card aria-label="Pet list" aria-busy={petListQuery.isFetching || undefined} className="overflow-hidden">
        {/* outside the data check: stays (with the typing and its focus) if the filter gets rejected */}
        <div className="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5">
          <PetFiltersForm
            httpError={petListQuery.error ?? undefined}
            initialPetFilters={query.filters}
            submitPetFilters={submitPetFilters}
          />
        </div>

        {data && !isPastEnd ? (
          <>
            <Table stackOnNarrow className="min-w-[1120px]">
              <caption className="sr-only">Pets</caption>
              <Thead>
                <Tr>
                  <Th onSort={toggleSort} sort={query.sort.name ?? undefined}>
                    Name
                  </Th>
                  <Th>Tag</Th>
                  <Th>Vaccinations</Th>
                  <Th shrink>ID</Th>
                  <Th shrink>Created</Th>
                  <Th shrink>Updated</Th>
                  <Th align="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((pet: PetResponse, i) => (
                  <Tr key={pet.id}>
                    <Td>
                      {pet._links?.read ? (
                        <Link
                          to={`/pet/${pet.id}`}
                          className="text-fg hover:text-link font-semibold no-underline hover:underline"
                        >
                          {pet.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{pet.name}</span>
                      )}
                    </Td>
                    <Td label="Tag">
                      {pet.tag ? (
                        <span className="bg-line text-fg-secondary inline-block rounded-full px-2 py-0.5 text-[13px] font-medium">
                          {pet.tag}
                        </span>
                      ) : null}
                    </Td>
                    <Td label="Vaccinations">
                      {pet.vaccinations.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {pet.vaccinations.slice(0, visibleVaccinations).map((vaccination, y) => (
                            <span
                              key={y}
                              className="border-chip-line bg-chip text-chip-fg rounded-md border px-2 py-0.5 text-[13px]"
                            >
                              {vaccination.name}
                            </span>
                          ))}
                          {pet.vaccinations.length > visibleVaccinations ? (
                            <span className="text-fg-muted text-[13px]">
                              <span aria-hidden="true">+{pet.vaccinations.length - visibleVaccinations}</span>
                              <span className="sr-only">and {pet.vaccinations.length - visibleVaccinations} more</span>
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </Td>
                    <Td label="ID" nowrap className="text-fg-placeholder text-[13px]">
                      {pet.id}
                    </Td>
                    <Td label="Created" nowrap className="text-fg-placeholder text-[13px]">
                      <DateTime value={pet.createdAt} />
                    </Td>
                    <Td label="Updated" nowrap className="text-fg-placeholder text-[13px]">
                      {pet.updatedAt ? <DateTime value={pet.updatedAt} /> : null}
                    </Td>
                    {/* stacked: the text of the first action aligned with the labels */}
                    <Td align="right" compact nowrap className="@max-3xl:-ml-3">
                      {pet._links?.read ? (
                        <AnchorButton
                          data-testid={`read-pet-${i}`}
                          to={`/pet/${pet.id}`}
                          variant="ghost"
                          size="sm"
                          aria-label={`View ${pet.name}`}
                        >
                          <EyeIcon />
                          View
                        </AnchorButton>
                      ) : null}
                      {pet._links?.update ? (
                        <AnchorButton
                          data-testid={`update-pet-${i}`}
                          to={`/pet/${pet.id}/update`}
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${pet.name}`}
                        >
                          <PencilIcon />
                          Edit
                        </AnchorButton>
                      ) : null}
                      {pet._links?.delete ? (
                        <Button
                          data-testid={`remove-pet-${i}`}
                          variant="ghost-danger"
                          size="sm"
                          aria-label={`Delete ${pet.name}`}
                          onClick={() => setPetToDelete(pet)}
                        >
                          <TrashIcon />
                          Delete
                        </Button>
                      ) : null}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {data.items.length === 0 ? (
              <div className="text-fg-muted flex flex-col items-center gap-2.5 px-4 py-12">
                {query.filters.name ? (
                  <>
                    <strong className="text-fg">No pets match “{query.filters.name}”</strong>
                    <Button
                      data-testid="pet-filters-clear"
                      variant="secondary"
                      size="sm"
                      onClick={() => submitPetFilters({ ...query.filters, name: undefined })}
                    >
                      Clear filter
                    </Button>
                  </>
                ) : (
                  <strong className="text-fg">No pets yet</strong>
                )}
              </div>
            ) : null}

            <Pagination
              offset={data.offset}
              limit={data.limit}
              count={data.count}
              pageTo={(page) => `/pet?${qs.stringify({ ...query, page })}`}
            />
          </>
        ) : null}
      </Card>
      {petToDelete ? (
        <DeleteDialog
          name={petToDelete.name}
          isPending={petDeleteMutation.isPending}
          onCancel={() => setPetToDelete(undefined)}
          onConfirm={() => petDeleteMutation.mutate(petToDelete)}
        />
      ) : null}
    </div>
  );
};

export default List;
