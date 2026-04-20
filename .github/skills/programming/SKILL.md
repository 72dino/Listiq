---
name: programming
user-invocable: true
description: 'WORKFLOW SKILL — Reusable programming workflows for implementing, refactoring, testing, and reviewing code.'
argument-hint: "What should this skill produce? e.g., 'implement endpoint', 'refactor module', 'add unit tests', 'review PR'"
---

Related skill: `agent-customization`. Load and follow **skills.md** for template and principles.

Guide the user to create or apply a Programming-focused `SKILL.md` that packages recurring coding workflows.

## Extract from Conversation
When invoked, attempt to infer and extract from the conversation:
- The concrete step-by-step process the user is following (implement → test → review → merge).
- Decision points and branching logic (e.g., when to write tests first, when to refactor vs. add new code).
- Quality criteria (style guide, test coverage target, performance constraints) and completion checks.

If the conversation includes code snippets or file paths, record which files are in-scope and any entry points.

## Clarify if Needed
If required details are missing, ask the user these concise questions:
- What is the desired outcome? (implement, refactor, test, review)
- Which language, framework, and version?
- Workspace-scoped or personal preference? (where to save files)
- Style guide, linters, or test frameworks to enforce?
- Scope: single file, module, package, or repository-wide?
- Any performance or compatibility constraints?

## Iterate
1. Draft the proposed steps and required code changes.
2. Present a short checklist and any assumptions for user confirmation.
3. Implement the changes as a patch (or provide exact edits) and run quick validations (lint, tests) if requested.
4. Ask for feedback and iterate until acceptance.

## Decision Flow
- Use this **Skill** when the user asks for a multi-step programming workflow (design → implement → test → review).
- Use a **Prompt** for single, focused tasks (e.g., "Generate JSON schema for this object").
- Use **Instructions** (always-on) only for persistent, repository-wide conventions (coding standards, commit message rules).
- Use a **Custom Agent** when the workflow requires staged tool restrictions, isolated context, or long-running subagents.

## Creation Process (author guidance)
- Scope: Choose `workspace` for team-shared workflows (save under `.github/skills/programming/`) or `user` for personal ones (`${VSCODE_USER_PROMPTS_FOLDER}`).
- Frontmatter: Keep `name`, `description`, and `argument-hint` succinct and include trigger keywords in `description` so the agent discovers the skill.
- Body: Include the extraction checklist, clarifying questions, iteration steps, decision flow, and common pitfalls.
- Validation: Verify YAML syntax, check `description` contains likely trigger phrases, and ensure file path matches `name`.

## Quick Reference
- Typical file location: `.github/skills/programming/SKILL.md`
- When to invoke: multi-step requests like "Implement X with tests" or "Refactor module and update callers".
- Expected inputs: goal, target files or directories, language/framework, style/test preferences.

## Outputs
- A clear step-by-step plan for the requested programming task.
- A patch or set of file edits (diff) to apply to the repository, or detailed code snippets if edits are not permitted.
- A validation checklist (lint commands, test commands) the user can run.

## Suggested Example Prompts (try these)
- "Use the Programming skill to implement a POST /users endpoint with validations and unit tests."
- "Refactor the `auth` module to use async/await and update all callers."
- "Add unit tests for `src/utils/*.js` to reach 80% coverage and fix failing cases."

## Validation Checklist
- YAML frontmatter present and valid (--- markers)
- `description` includes trigger keywords (implement|refactor|test|review)
- File saved under `.github/skills/programming/SKILL.md` or user prompts folder when personal
- If applying patches: run `npm test`/`pytest`/`go test` or the project's test command (ask the user for the command)

## Common Pitfalls
- Omitting trigger keywords in `description` prevents discovery.
- Overbroad `applyTo: "**"` can cause noisy context injection.
- Not specifying language/framework → ambiguous edits or incorrect snippets.

## Next Customizations (ideas)
- Add sub-skills for specific languages: `programming-python`, `programming-node`, `programming-go`.
- Provide templates for common tasks (add-controller, add-service, add-integration-test).
- Include optional `examples/` directory with sample diffs and test fixtures.

## Notes to the author
- Prefer workspace scope for team workflows. Save this file to `.github/skills/programming/SKILL.md` for team use.
- Follow the `agent-customization` guidelines for naming, frontmatter, and `description` triggers.
