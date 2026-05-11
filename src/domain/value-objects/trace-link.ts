export interface TraceLink {
  readonly fromId: string;
  readonly toId: string;
  readonly type:
    | "satisfies"
    | "implements"
    | "verifies"
    | "depends_on"
    | "belongs_to_feature";
}
