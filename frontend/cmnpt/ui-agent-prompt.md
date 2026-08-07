# UI Agent Prompt

Use this prompt when giving an agent a reference image:

```text
Use the reference image to guide the UI.

Before building:
1. Read AGENTS.md and docs/ui-reference-rules.md.
2. Extract the design system from the image:
   - colors
   - typography
   - spacing
   - border radius
   - shadows
   - repeated components
   - layout structure
3. Create or update shared tokens first.
4. Create or update reusable components second.
5. Build the page or section using those shared pieces.
6. Keep the output responsive and production-ready.
7. Do not use raw image-to-code output as final code without cleanup.

When you begin, first summarize:
- extracted tokens
- reusable components to build or reuse
- sections to assemble
```
