# AGENTS

Repository conventions for Athena.

## Source and tests

- Productive code lives under `src/`.
- Tests live under `test/` and mirror the same folder/file structure as `src/`.
- For each `src/foo/bar.ts`, keep matching files:
  - `test/foo/bar.test.ts`
  - `test/foo/bar.fixtures.ts`
  - `test/foo/bar.builders.ts`
- Use minimal smoke tests when behavior tests are not yet implemented.

## Documentation language

- Keep `README.md` in English.

## Guardrails

- Do not change SRS documents as part of test scaffolding tasks.
- Do not change productive logic unless type exports are strictly needed for compilation.
