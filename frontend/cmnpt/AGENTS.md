# Project Instructions

## Purpose
This project uses reference-image-driven UI building. When a reference image is provided, the agent must analyze the image first and then build the UI from reusable tokens and components.

## Required Workflow
Do not start by directly coding the full page from the image.

When a reference image is provided:
1. Read `docs/ui-reference-rules.md`.
2. Extract the visual system from the image before writing UI code.
3. Create or update design tokens first.
4. Create or update reusable UI components next.
5. Build sections and pages only after the shared primitives are aligned.
6. Keep the result responsive across desktop and mobile.
7. Normalize and clean any image-to-code output before using it in the project.

## Extraction Requirements
For each reference image, explicitly identify:
- Layout structure
- Color palette
- Typography hierarchy
- Spacing scale
- Border radius
- Shadows and borders
- Repeated component patterns
- Interaction states when inferable
- Mobile behavior when inferable

## Build Priorities
- Prefer consistency over pixel-copying.
- Prefer reusable components over one-off markup.
- Prefer project tokens over hard-coded values.
- Prefer accessible semantic HTML.
- Preserve the existing project style if one already exists.

## Output Expectations
Before major UI implementation, the agent should be able to summarize:
- The extracted design tokens
- The components to build or reuse
- The page sections to assemble

## File Conventions
- Store reusable UI components under `components/ui/` when applicable.
- Store shared page sections under `components/sections/` when applicable.
- Store shared visual tokens in `styles/design-tokens.css` unless the project already uses another theme system.

## Optional Generators
- `shadcn/ui` style components may be used as a base system.
- Generated UI from tools like `v0` or image-to-code should be treated as draft input, not final production code.
