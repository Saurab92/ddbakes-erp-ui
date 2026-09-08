import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mockDelay, generateId } from '@/utils/mock'
import type { CreateUnitInput, Unit, UpdateUnitInput } from '@/features/units/types'

/**
 * Set to `false` (or delete this module's mock branch) once the Spring Boot
 * `/units` endpoints are available. Every function below keeps the same
 * signature in both modes so callers never need to change.
 */
const USE_MOCK_API = false

let mockUnits: Unit[] = [
  { id: generateId(), name: 'Kilogram', code: 'KG', active: true },
  { id: generateId(), name: 'Liter', code: 'LTR', active: true },
  { id: generateId(), name: 'Packet', code: 'PKT', active: true },
  { id: generateId(), name: 'Piece', code: 'PCS', active: true },
]

/** Shape returned by the Spring Boot API: the id is numeric on the wire. */
interface UnitResponse extends Omit<Unit, 'id'> {
  id: number
}

/** Normalize the wire payload to the frontend model (id as string). */
function toUnit(response: UnitResponse): Unit {
  return { ...response, id: String(response.id) }
}

const realUnitApi = {
  getUnits: () =>
    apiClient
      .get<UnitResponse[]>(endpoints.units.root)
      .then((units) => units.map(toUnit)),
  createUnit: (input: CreateUnitInput) =>
    apiClient.post<UnitResponse>(endpoints.units.root, input).then(toUnit),
  updateUnit: (id: string, input: UpdateUnitInput) =>
    apiClient.put<UnitResponse>(endpoints.units.byId(id), input).then(toUnit),
  setUnitStatus: (id: string, active: boolean) =>
    apiClient
      .patch<UnitResponse>(endpoints.units.status(id), { active })
      .then(toUnit),
}

const mockUnitApi = {
  async getUnits(): Promise<Unit[]> {
    await mockDelay()
    return [...mockUnits]
  },
  async createUnit(input: CreateUnitInput): Promise<Unit> {
    await mockDelay()
    const unit: Unit = { id: generateId(), ...input }
    mockUnits = [...mockUnits, unit]
    return unit
  },
  async updateUnit(id: string, input: UpdateUnitInput): Promise<Unit> {
    await mockDelay()
    const existing = mockUnits.find((unit) => unit.id === id)
    if (!existing) {
      throw new Error('Unit not found')
    }
    const updated: Unit = { ...existing, ...input }
    mockUnits = mockUnits.map((unit) => (unit.id === id ? updated : unit))
    return updated
  },
  async setUnitStatus(id: string, active: boolean): Promise<Unit> {
    await mockDelay()
    const existing = mockUnits.find((unit) => unit.id === id)
    if (!existing) {
      throw new Error('Unit not found')
    }
    const updated: Unit = { ...existing, active }
    mockUnits = mockUnits.map((unit) => (unit.id === id ? updated : unit))
    return updated
  },
}

export const unitApi = USE_MOCK_API ? mockUnitApi : realUnitApi
