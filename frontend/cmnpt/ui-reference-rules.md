# UI Reference Rules

## Goal
Turn a reference image into a clean, reusable, production-ready UI system instead of copying isolated pieces blindly.

## Step 1: Analyze The Reference
Extract the following from the image:

### Layout
- Page type
- Main sections
- Content width
- Grid or column structure
- Alignment patterns
- Visual hierarchy

### Color
- Background
- Surface
- Primary
- Secondary
- Accent
- Text
- Muted text
- Border
- Shadow color tendency

### Typography
- Heading style
- Body style
- Label style
- Button text style
- Density and contrast of text hierarchy

### Spacing
- Section spacing
- Container padding
- Card padding
- Grid gaps
- Button padding
- Input padding

### Shape And Effects
- Border radius scale
- Border weight
- Shadow softness
- Blur or glass effects
- Icon treatment

### Components
- Navbar
- Hero
- Buttons
- Cards
- Inputs
- Badges
- Tabs
- Modals or dialogs
- Footer
- Repeated section patterns

## Step 2: Convert The Analysis Into Tokens
Prefer defining or updating shared tokens before building UI.

Minimum token groups:
- Colors
- Typography sizes
- Spacing scale
- Radius scale
- Shadow scale
- Border styles

## Step 3: Build Reusable Components
Create or reuse shared components before building the whole page.

Preferred order:
1. Button
2. Input
3. Card
4. Badge
5. Section container
6. Navbar
7. Footer
8. Any image-specific custom block

## Step 4: Assemble The UI
Build the UI using the shared tokens and components.

Rules:
- Avoid hard-coded colors when a token can be used.
- Avoid repeated spacing values when a token can be used.
- Avoid one-off button styles if a shared button can be extended.
- Match overall rhythm and feel more than exact pixels.

## Step 5: Responsive Pass
Before considering the UI done:
- Check mobile layout collapse
- Check typography scaling
- Check spacing reduction
- Check button and input tap size
- Check overflow issues
- Check wrapping of nav and card content

## Step 6: Polish Pass
Add only meaningful polish:
- Hover states
- Focus states
- Entry animation when useful
- Loading or empty states if relevant

## Anti-Patterns
Do not:
- Treat image-to-code output as final code
- Mix many unrelated component styles
- Hard-code every spacing value from scratch
- Build the full page before making shared primitives
- Ignore accessibility and semantic structure

## Recommended Working Summary
Before large UI implementation, summarize:
- Extracted tokens
- Planned components
- Planned page sections
- Any unclear visual assumptions
