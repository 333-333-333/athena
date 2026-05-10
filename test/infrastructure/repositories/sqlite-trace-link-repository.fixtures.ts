import { buildSqliteTraceLink } from "./sqlite-trace-link-repository.builders";

export const sqliteTraceLinkRepositoryFixtures = {
  first: buildSqliteTraceLink({
    fromId: "REQ-2",
    toId: "UC-2",
    type: "satisfies",
  }),
  second: buildSqliteTraceLink({
    fromId: "REQ-2",
    toId: "FUN-2",
    type: "implements",
  }),
  third: buildSqliteTraceLink({
    fromId: "UC-2",
    toId: "TEST-2",
    type: "verifies",
  }),
};
