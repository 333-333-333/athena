export interface Risk {
  readonly id: string;
  readonly description: string;
  readonly level: "low" | "medium" | "high";
}
