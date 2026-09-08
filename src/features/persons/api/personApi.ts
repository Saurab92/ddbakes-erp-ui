import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreatePersonInput, Person, UpdatePersonInput } from '@/features/persons/types'

interface PersonResponse extends Omit<Person, 'id' | 'departmentId'> {
  id: number
  departmentId: number
}

function toPerson(response: PersonResponse): Person {
  return {
    ...response,
    id: String(response.id),
    departmentId: String(response.departmentId),
  }
}

function toRequest(input: CreatePersonInput) {
  return { ...input, departmentId: Number(input.departmentId) }
}

export const personApi = {
  getPersons: () =>
    apiClient
      .get<PersonResponse[]>(endpoints.persons.root)
      .then((persons) => persons.map(toPerson)),
  createPerson: (input: CreatePersonInput) =>
    apiClient.post<PersonResponse>(endpoints.persons.root, toRequest(input)).then(toPerson),
  updatePerson: (id: string, input: UpdatePersonInput) =>
    apiClient.put<PersonResponse>(endpoints.persons.byId(id), toRequest(input)).then(toPerson),
  deactivatePerson: (id: string) =>
    apiClient.patch<void>(endpoints.persons.deactivate(id)),
  deletePerson: (id: string) => apiClient.delete<void>(endpoints.persons.byId(id)),
}