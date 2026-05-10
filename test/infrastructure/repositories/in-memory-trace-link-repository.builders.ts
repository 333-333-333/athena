import type { TraceLink } from "../../../src/domain";

export const buildTraceLink = (
  overrides: Partial<TraceLink> = {},
): TraceLink => ({
  fromId: overrides.fromId ?? "REQ-1",
  toId: overrides.toId ?? "UC-1",
  type: overrides.type ?? "satisfies",
});
