/** Simulates network latency for mock API modules. */
export function mockDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateId(): string {
  return crypto.randomUUID()
}
