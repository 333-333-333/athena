import type { TraceLink } from "../../../src/domain";

export const buildSqliteTraceLink = (
  overrides: Partial<TraceLink> = {},
): TraceLink => ({
  fromId: overrides.fromId ?? "REQ-2",
  toId: overrides.toId ?? "UC-2",
  type: overrides.type ?? "satisfies",
});
