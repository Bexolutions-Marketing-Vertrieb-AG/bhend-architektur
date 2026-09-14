/**
 * Fail-closed when ORBITYPE_EXPECTED_* env vars are set.
 * @param {{ projectId?: string | null, connectorId?: string | null }} context
 */
export function assertExpectedContext(context) {
  const expectedProject = process.env.ORBITYPE_EXPECTED_PROJECT_ID?.trim()
  const expectedConnector = process.env.ORBITYPE_EXPECTED_CONNECTOR_ID?.trim()

  if (
    expectedProject &&
    context.projectId &&
    context.projectId !== expectedProject
  ) {
    throw new Error(
      `FAIL  projectId ${context.projectId} !== ORBITYPE_EXPECTED_PROJECT_ID (${expectedProject})`,
    )
  }
  if (
    expectedConnector &&
    context.connectorId &&
    context.connectorId !== expectedConnector
  ) {
    throw new Error(
      `FAIL  connectorId ${context.connectorId} !== ORBITYPE_EXPECTED_CONNECTOR_ID (${expectedConnector})`,
    )
  }

  // Fail closed when expected is set but context could not be resolved
  if (expectedProject && !context.projectId) {
    throw new Error(
      "FAIL  ORBITYPE_EXPECTED_PROJECT_ID is set but connector projectId is unknown",
    )
  }
  if (expectedConnector && !context.connectorId) {
    throw new Error(
      "FAIL  ORBITYPE_EXPECTED_CONNECTOR_ID is set but connectorId is unknown",
    )
  }
}
