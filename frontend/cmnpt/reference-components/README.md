# Playful Illustrative Card & List Components

These components were extracted from your reference images and implemented as clean, modular JavaScript builders and CSS style classes.

## Visual Design Tokens Extracted

### 1. Board Cards
- **Color Palette**:
  - Red/Coral: `#f86f5c`
  - Yellow: `#ffd875`
  - Orange/Peach: `#ffb875`
  - Green/Mint: `#76c893`
  - Text & Borders: `#1e293b`
- **Border styling**: `2px solid #1e293b` thick borders (neo-brutalist cartoon styling)
- **Top Circle Pin decoration**: A custom center-top relative circular badge to resemble hanging pinned cards.
- **Rounded Corners**: `border-radius: 20px`.
- **Drop Shadow**: solid offset border-color shadow (`box-shadow: 0 6px 0 #1e293b`) that slides down on hover.

### 2. List & Progress Container Card
- **Background**: Soft cream/off-white background `#faf8f5`.
- **Divider style**: Dashed grey divider lines between items (`2px dashed #cbd5e1`).
- **Square Badges**: Raised white squares with solid black outlines and offsets.
- **Progress Track**: Rounded container tracks with a thick border, filled with warm yellow-orange progress indicators.

## Files Created

1. **[ReferenceCards.js](file:///D:/Project_X/frontend/cmnpt/reference-components/ReferenceCards.js)** / **[ReferenceCards.css](file:///D:/Project_X/frontend/cmnpt/reference-components/ReferenceCards.css)**: Holds layouts for board cards.
2. **[ListContainer.js](file:///D:/Project_X/frontend/cmnpt/reference-components/ListContainer.js)** / **[ListContainer.css](file:///D:/Project_X/frontend/cmnpt/reference-components/ListContainer.css)**: Holds the Daily Quest / progress list container.

## How to Import & Use

```javascript
import { ListContainer } from './cmnpt/reference-components/ListContainer.js';
import './cmnpt/reference-components/ListContainer.css';

// Renders the list with custom values:
const customListHTML = ListContainer({
  title: "My Custom Tasks",
  items: [
    { badgeText: "A1", title: "Complete design review", current: 4, total: 5 },
    { badgeText: "B2", title: "Submit code changes", current: 8, total: 10 }
  ]
});
```

