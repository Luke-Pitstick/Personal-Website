---
title: Safe Agentic Coding
description: A small collection of agent skills for making Codex-style coding workflows more reproducible, evidence-driven, and safe.
date: 2026-06-17
draft: false
---

[Safe Agentic Coding](https://github.com/Luke-Pitstick/safe-agentic-coding) is a small collection of agent skills for making agentic coding workflows more reproducible, more careful, and easier to hand off between sessions.

The basic idea is simple: coding agents work better when the workflow is explicit. A good agent should know when to stop and decompose work, when to research existing tools before building something custom, when to use runtime evidence instead of guessing, when to write tests, and when to clean up repo state before handing the work back.

The repository packages those habits as reusable `SKILL.md` folders that can be installed into Codex, Claude Code, or adapted into Cursor rules. It is not trying to be a giant framework. It is more like a small operating manual for the parts of agentic coding that tend to get messy when they are left implicit.

## The Shape

The workflow I am aiming for looks like this:

```text
create project -> expand/decompose work -> research or simplify -> delegate implementation -> debug with runtime evidence -> test/review -> clean up repo state
```

Each skill follows the Agent Skills folder format:

```text
skill-name/
|-- SKILL.md
|-- agents/openai.yaml
`-- references/
```

The `SKILL.md` file contains YAML frontmatter with the skill name and description, followed by the instructions the agent should load when the skill matches a task. Some skills also include reference files for templates, dispatch prompts, instrumentation patterns, and validation checklists.

That structure matters because it gives the agent a predictable place to look. Instead of hoping a model remembers a workflow from chat history, the workflow lives in files that can be versioned, copied, edited, and installed project by project.

## Why Skills Help

Most agent mistakes I run into are not from a lack of code generation ability. They come from workflow drift.

An agent starts implementing before the task is understood. It writes custom infrastructure before checking whether a mature library already exists. It tries to debug from vibes instead of evidence. It leaves temporary logs behind. It creates a plan that only makes sense inside the current chat window. It edits too much because no one told it where the boundary was.

Skills are a useful way to push back on that drift. They make the agent pause at the right moments and switch into a narrower mode:

- planning mode when the work is too broad;
- research mode when existing tools might remove complexity;
- runtime-debug mode when static inspection is not enough;
- test-writing mode when behavior needs to be locked down;
- cleanup mode when local repo state has started to accumulate junk.

The result is less glamorous than a fully autonomous "ship everything" agent, but much more useful in practice. It gives the agent a rail to run on.

## Included Skills

The repository currently includes a focused set of skills:

| Skill | Purpose |
| --- | --- |
| `create-project` | Creates a conservative starter project with `README.md`, `AGENTS.md`, `agents/`, and `docs/`. |
| `decompose-task` | Splits broad work into agent-ready task cards with scope, context, validation, dependencies, and handoff artifacts. |
| `delegate-agent-tasks` | Coordinates subagents to execute task cards, validate their work, integrate results, and checkpoint progress. |
| `expand-task` | Turns a small or vague prompt into a narrower implementation brief. |
| `deep-dive` | Performs focused web research with sourced findings for product, technical, market, and company questions. |
| `science-check` | Tests an idea against scientific or technical evidence, including uncertainty and evidence quality. |
| `tech-discovery` | Finds reusable technologies, libraries, APIs, datasets, standards, or open source projects before custom implementation. |
| `simplify-code` | Looks for behavior-preserving ways to reduce code complexity. |
| `debug-runtime` | Debugs tricky bugs with temporary identifiable instrumentation, logs, backtraces, evidence, narrow fixes, and cleanup. |
| `write-tests` | Designs and writes unit, integration, regression, contract, and workflow tests. |
| `write-docstrings` | Adds or improves API documentation comments and docstrings in the current language's style. |
| `update-gitignore` | Audits ignored files, updates `.gitignore`, and untracks ignored files without deleting local copies. |

The two skills I reach for most often are `decompose-task` and `debug-runtime`.

## Decompose, Then Delegate

`decompose-task` is a planning skill, but the output is meant to be executable by other agents. It writes task cards into the workspace's `agents/` folder. Each card should include the outcome, scope, context packet, instructions, acceptance criteria, validation method, dependencies, and expected handoff.

That context packet is the important part. A useful task card should not depend on hidden chat history. Another agent should be able to open the file, read the card, inspect the named files, and start working.

The companion skill, `delegate-agent-tasks`, uses those cards as a dispatch plan. It decides what can run in parallel, keeps file ownership explicit, applies validation gates, integrates results, and creates coherent checkpoints when appropriate.

A typical flow looks like this:

```text
Use $decompose-task to break this project goal into agent-ready subtasks and write them to agents/subtasks.md.
```

Then, after reviewing the generated plan:

```text
Use $delegate-agent-tasks to execute the task cards in agents/subtasks.md.
```

This is where an `agents/` folder becomes useful. It stops being a scratchpad and becomes a little control plane for the work: task plans, handoff notes, implementation artifacts, QA reports, and review outputs can all live in one place.

## Debug With Runtime Evidence

`debug-runtime` is modeled after the debugging loop I wish agents used by default.

When a bug is hard to understand from code inspection alone, the skill asks the agent to form hypotheses, add temporary identifiable instrumentation, reproduce the issue, use the logs or backtraces to choose a root cause, patch narrowly, verify, and then remove the instrumentation before final handoff.

The instrumentation has a unique marker like this:

```text
DEBUG_RUNTIME_<YYYYMMDD>_<task-slug>
```

That marker makes cleanup auditable. The agent can search for every temporary log line before it finishes. The skill also tells the agent not to log secrets, auth headers, raw user payloads, private keys, sensitive PII, or regulated data.

The point is not "add logs everywhere." The point is to make debugging evidence-driven:

- state the hypotheses first;
- log only the values that confirm or disprove them;
- reproduce the bug with the smallest useful command or user flow;
- patch the smallest root cause;
- rerun validation after the debug logs are removed.

That last step matters. A fix that only works while temporary debug code is present is not done.

## A Minimal Repo Convention

To make a repo friendly to agentic workflows, I like this minimal structure:

```text
AGENTS.md
agents/
docs/
```

`AGENTS.md` gives coding agents the local rules of the road. `agents/` holds plans, task cards, handoffs, and agent artifacts. `docs/` holds project documentation, specs, architecture notes, and decision records.

A small `AGENTS.md` can be enough:

```markdown
# AGENTS

Agent configs and related files live in `agents/`.

Project documentation lives in `docs/`.

## Skill routing

When the user's request matches an available skill, route to that skill and follow its instructions before answering directly.

Key routing rules:

- Break down broad work -> `decompose-task`
- Dispatch subagents -> `delegate-agent-tasks`
- Write or improve tests -> `write-tests`
- Expand a small prompt into an implementation brief -> `expand-task`
- Focused web research -> `deep-dive`
- Scientific or technical grounding -> `science-check`
- Runtime-first bug debugging -> `debug-runtime`
- Clean ignored files -> `update-gitignore`
- Reduce code complexity -> `simplify-code`
- Find reusable technologies for a project -> `tech-discovery`
```

The file does not need to be long. It just needs to make the default route obvious.

## Installing in Codex

Codex can use the skill folder shape directly. For a global install:

```sh
mkdir -p ~/.codex/skills
cp -R skills/* ~/.codex/skills/
```

For a project-local install, when your Codex setup supports project skills:

```sh
mkdir -p .codex/skills
cp -R skills/* .codex/skills/
```

Restart Codex after installing so the skill list refreshes.

To install a single skill:

```sh
cp -R skills/simplify-code ~/.codex/skills/simplify-code
```

The same `SKILL.md` folder format can also be copied into Claude Code skill directories, zipped for Claude surfaces that support uploaded skills, or adapted into Cursor `.mdc` project rules.

## What I Like About This Setup

Safe Agentic Coding is intentionally boring in a few good ways.

It stores important coordination artifacts in the repo. It prefers explicit task cards over hidden context. It asks agents to research before building common infrastructure. It treats runtime evidence as a first-class debugging input. It nudges every broad request toward a smaller, testable unit of work.

That makes the agent feel less like a magic text box and more like a teammate with a checklist, a notebook, and a habit of cleaning up after itself.

The project is small enough to read, copy, and adapt. That is the point. If a skill does not match your workflow, change it. If your team has a better review gate, add it. If your repo needs stronger safety rules, write them into `AGENTS.md` and keep the agent honest.

Agentic coding gets better when the workflow is inspectable. Safe Agentic Coding is my current attempt to make that workflow concrete.
