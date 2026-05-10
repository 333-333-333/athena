# Athena MCP

Athena MCP is a base server/project for specification and quality work in an MCP workflow, built with Bun + TypeScript.

Current status: a Clean Architecture skeleton, with structure and contracts in place, but without real business behavior implemented yet.

## Main layers

- domain: entities, value objects, and domain policies.
- application: ports (input/output) and use cases.
- infrastructure: concrete adapters (in-memory/null repositories and gateways).
- interfaces: external inputs/outputs (CLI adapter and MCP adapter).
- composition root: dependency assembly.

## Available Bun commands

```bash
bun install
bun run lint
bun run format
bun run check
bun run check:format
bun run check:types
```

## Tooling

- Biome for linting and formatting.
- TypeScript for type checking (`bunx tsc --noEmit`).

## How to run validations

```bash
# typecheck
bun run check:types

# lint
bun run lint

# format (applies changes)
bun run format

# format (verification only)
bun run check:format

# lint + format in a single command
bun run check
```

## Current limits

- Architectural skeleton: contracts and stubs exist, but complete functional logic does not.
- Not ready for production or real end-to-end workflows.

## Suggested next steps

1. Implement real behavior in priority use cases.
2. Connect concrete gateways/repositories (persistence and integrations).
3. Add unit and integration tests per layer.
4. Strengthen domain validations and traceability.
