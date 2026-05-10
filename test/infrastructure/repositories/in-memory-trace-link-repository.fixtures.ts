import { buildTraceLink } from "./in-memory-trace-link-repository.builders";

export const inMemoryTraceLinkRepositoryFixtures = {
  first: buildTraceLink({ fromId: "REQ-1", toId: "UC-1", type: "satisfies" }),
  second: buildTraceLink({
    fromId: "REQ-1",
    toId: "FUN-1",
    type: "implements",
  }),
  third: buildTraceLink({ fromId: "UC-1", toId: "TEST-1", type: "verifies" }),
};
