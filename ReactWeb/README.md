# VoyageRetail — Retailer Management Platform

A modern, travel-platform-inspired Retailer Management Web Application combining **Airbnb's clean minimalism** with **Expedia's structured blue-and-white visual language**.

---

## 🎨 Design Language Fusion

### 1. Airbnb-Inspired Minimalism
- **Canvas & Spacing**: Pure white (`#ffffff`) surfaces with crisp typography and subtle hairlines (`#e2e8f0`).
- **Rounded Surfaces**: 14px–16px card border radii (`--radius-md`) and pill filter badges (`--radius-full`).
- **Photography-First**: Rich, high-resolution imagery for retail storefronts with subtle hover zoom and elevation.
- **Heart Wishlist / Bookmark**: Interactive save toggle on listing cards.
- **Micro-Interactions**: Smooth hover lifts, subtle transitions, and accessible focus outlines.

### 2. Expedia-Inspired Structured Visuals
- **Color Palette**:
  - Expedia Deep Navy (`#00355f`): Header accents, score badge backgrounds, and brand emphasis.
  - Expedia Travel Blue (`#0057b8` / `#006ce4`): Strong primary CTA buttons, active state indicators, and search triggers.
  - Accent Tones: Emerald green for verified active status and amber for VIP Partner badges.
- **Prominent Search Bar**: A segmented booking-bar widget with inputs for Brand/Keyword, Category, Airport Hub, Rating threshold, and a high-contrast search CTA.
- **Structured Information Hierarchy**: Expedia score badges (e.g., `9.6 Exceptional`) with review counts, price tier (`$$$`), and partner commission percentages.
- **Comparison Table View**: Structured data table for inventory management alongside the card grid view.
- **Dashboard Metrics Bar**: Quick KPI tiles showing Total Retailers, Active & Operating, Top Rated (9.5+), and Global Airport Hubs.

---

## 🚀 Key Functional Features

1. **View Retailers**:
   - **Grid View**: Airbnb-style photo-first cards with quick actions.
   - **Table View**: Expedia-style inventory table with sorting and quick action buttons.
2. **Add New Retailer**:
   - Comprehensive modal with validation (Name, Category, Hub, Terminal, Gate, Rating, Reviews, Price Tier, Commission, Status, VIP toggle, HD Image URL with built-in presets, Overview, Perks, and Contact details).
3. **Edit Retailer**:
   - Instant pre-populated modal allowing full updates to any field.
4. **Delete Retailer**:
   - Safety confirmation dialog preventing accidental deletions with warning details.
5. **View Details**:
   - Dedicated modal drawer displaying high-res banner, terminal directions, operating hours, traveler perks, and concession contacts.
6. **Search & Multi-Filter**:
   - Live keyword search (retailer name, brand, perks, description, gate).
   - Category filter (Pill strip + dropdown).
   - Airport Hub filter (Heathrow, JFK, Dubai, Changi, Paris CDG, Tokyo Haneda, Frankfurt).
   - Minimum rating filter (9.5+ Exceptional, 9.0+ Wonderful, 8.5+ Very Good).
   - Status filters (Featured, Active, Under Review).
   - Sort selector (Highest Rated, Most Reviews, Alphabetical A-Z, Highest Commission).
7. **Loading & Empty States**:
   - Shimmering skeleton loaders for both Grid and Table views.
   - Filter empty state with one-click "Reset Filters" action.
   - Zero-data state with demo restoration CTA.
8. **Persistence & Demo Recovery**:
   - Stores all state in `localStorage` with a "Reset Demo" button in the navigation and footer.

---

## 🛠️ Tech Stack & Scripts

- **React 19**
- **Vite 8**
- **Vanilla CSS3** with semantic design tokens and responsive breakpoints
- **Oxlint** for ultra-fast static analysis

### Available Commands

```bash
# Start development server
npm run dev

# Build production bundle
npm run build

# Run linter
npm run lint
```
