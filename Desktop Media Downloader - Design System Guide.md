# Desktop Media Downloader - Design System Guide

## Overview

This design system provides comprehensive guidelines for building a modern, clean, and minimalistic desktop application for downloading YouTube videos, movies, and TV series. The system prioritizes user experience, accessibility, and maintainable component-based architecture.

## Core UI Framework & Libraries

### Primary Stack

* **ShadCN UI** - Component library foundation with excellent dark/light mode support and accessibility
* **TailwindCSS** - Utility-first styling for consistent spacing and sizing
* **Radix UI** - Primitive components for complex interactions (included with ShadCN)
* **Lucide React** - Consistent iconography with clean, minimal line icons

### Additional Dependencies

```bash
npm install @radix-ui/react-* tailwindcss @tailwindcss/forms
npm install lucide-react class-variance-authority clsx tailwind-merge
```

## Design System Foundation

### Color Palette

#### Dark Mode (Primary)

* **Background:** `#121416` - Main application background
* **Surface:** `#2c3135` - Elevated surfaces, cards, inputs
* **Border:** `#40484f` - Subtle borders and dividers
* **Text Primary:** `#ffffff` - Primary text content
* **Text Secondary:** `#a2abb3` - Secondary text, placeholders

#### Light Mode

* **Background:** `#fafafa` - Main application background
* **Surface:** `#f4f4f5` - Elevated surfaces, cards, inputs
* **Border:** `#e4e4e7` - Subtle borders and dividers
* **Text Primary:** `#09090b` - Primary text content
* **Text Secondary:** `#71717a` - Secondary text, placeholders

#### Semantic Colors

* **Primary:** `#3b82f6` - CTAs, active states, links
* **Success:** `#10b981` - Completed downloads, success states
* **Warning:** `#f59e0b` - Pending/processing states
* **Error:** `#ef4444` - Failed downloads, error states
* **Info:** `#06b6d4` - Informational messages

#### Color Usage Guidelines

```css
/* Use semantic color tokens */
.text-foreground { color: var(--foreground); }
.text-muted-foreground { color: var(--muted-foreground); }
.bg-background { background-color: var(--background); }
.bg-card { background-color: var(--card); }
```

### Typography

#### Font Family

* **Primary:** Inter - Excellent readability for UI text
* **Fallback:** "Noto Sans", system-ui, sans-serif

#### Type Scale

* **text-xs:** 12px - Small labels, captions
* **text-sm:** 14px - Body text, form inputs
* **text-base:** 16px - Default body text
* **text-lg:** 18px - Larger body text, small headings
* **text-xl:** 20px - Card titles, section headers
* **text-2xl:** 24px - Page titles
* **text-3xl:** 30px - Main headings

#### Font Weights

* **Regular (400):** Body text, descriptions
* **Medium (500):** Labels, navigation items
* **Semibold (600):** Card titles, important text
* **Bold (700):** Headings, CTAs

#### Line Heights

* **leading-tight:** 1.25 - Headings and titles
* **leading-normal:** 1.5 - Body text and descriptions
* **leading-relaxed:** 1.625 - Long-form content

### Spacing & Layout

#### Spacing Scale (4px base unit)

* **1:** 4px - Tight spacing
* **2:** 8px - Small gaps
* **3:** 12px - Medium gaps
* **4:** 16px - Standard spacing
* **6:** 24px - Large spacing
* **8:** 32px - Section spacing
* **12:** 48px - Page-level spacing
* **16:** 64px - Large page sections

#### Container Widths

* **sm:** 640px - Small content areas
* **md:** 768px - Medium content areas
* **lg:** 1024px - Large content areas
* **xl:** 1280px - Extra large layouts
* **2xl:** 1536px - Maximum content width

#### Layout Grid

```css
/* Main layout grid */
.app-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
}
```

## Component Architecture

### Component Categories

#### 1. Layout Components

* **AppHeader** - Top navigation with global controls
* **Sidebar** - Primary navigation (collapsible)
* **MainContent** - Primary content area
* **StatusBar** - Download progress and system status

#### 2. Form Components

* **Input** - Text inputs with variants (search, url)
* **Select** - Dropdown selections (quality, format)
* **Checkbox** - Multi-select options
* **RadioGroup** - Single select options (quality settings)
* **Button** - Primary, secondary, ghost, outline variants
* **Switch** - Toggle controls (dark mode, auto-download)

#### 3. Data Display

* **Card** - Content containers for media items
* **Table** - Download queue and history
* **List** - Search results, episode lists
* **ProgressBar** - Download progress indicators
* **Badge** - Status indicators, quality tags

#### 4. Feedback Components

* **Toast** - Temporary notifications
* **Alert** - Persistent notifications
* **LoadingSpinner** - Loading states
* **EmptyState** - No content states
* **ErrorBoundary** - Error handling

#### 5. Navigation

* **Tabs** - Content type switching (Movies, TV, YouTube)
* **Breadcrumb** - Navigation hierarchy
* **Pagination** - Search results navigation

#### 6. Overlay Components

* **Modal** - Settings, confirmations
* **Dropdown** - Context menus, action lists
* **Tooltip** - Additional information
* **Popover** - Rich content overlays

### Component Design Principles

#### Consistent Props API

```typescript
interface BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}
```

#### Compound Components

```typescript
// Example: Select component
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select quality" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="720p">720p</SelectItem>
    <SelectItem value="1080p">1080p</SelectItem>
    <SelectItem value="4k">4K</SelectItem>
  </SelectContent>
</Select>
```

#### Visual Consistency

* **Border Radius:** `rounded-lg` (8px) for most components, `rounded-xl` (12px) for cards
* **Elevation:** Use subtle box-shadows and borders instead of heavy shadows
* **Focus States:** Consistent focus rings using `focus:ring-2 focus:ring-primary`

## Modern UI Patterns for Desktop

### Layout Structure

#### Primary Layout

```
┌─────────────────────────────────────────┐
│              Header Bar                 │
├───────────┬─────────────────────────────┤
│           │                             │
│  Sidebar  │       Main Content          │
│           │                             │
│           │                             │
├───────────┴─────────────────────────────┤
│              Status Bar                 │
└─────────────────────────────────────────┘
```

#### Content Organization

* **Card-based Layout** for download items and search results
* **Tab Navigation** for content types (YouTube, Movies, TV Series)
* **Progressive Disclosure** - basic options first, advanced on demand
* **Contextual Actions** - relevant buttons based on selection state

### Desktop-Specific Patterns

* **Sidebar Navigation** - Collapsible with primary actions
* **Context Menus** - Right-click actions for download items
* **Drag & Drop** - File uploads and queue organization
* **Keyboard Shortcuts** - Quick actions (Ctrl+N, Ctrl+D, etc.)
* **Multi-selection** - Bulk operations on download items

## Animation & Interaction Guidelines

### Animation Principles

* **Performance First** - Use transform and opacity properties
* **Purposeful** - Every animation should have a clear purpose
* **Consistent** - Same duration and easing for similar interactions
* **Respectful** - Honor user's motion preferences

### Animation Specifications

#### Duration

* **Fast (150ms)** - Micro-interactions, hover states
* **Medium (300ms)** - Page transitions, modal animations
* **Slow (500ms)** - Complex state changes, loading animations

#### Easing Functions

* **ease-out** - Entrances, expanding elements
* **ease-in** - Exits, collapsing elements
* **ease-in-out** - Bidirectional animations

#### Common Animations

```css
/* Hover states */
.hover-lift {
  transition: transform 150ms ease-out;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Loading states */
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Page transitions */
.fade-in {
  animation: fadeIn 300ms ease-out;
}
```

### Interaction States

* **Hover** - Subtle scale (1.02) or opacity (0.8) changes
* **Active** - Scale down (0.98) for buttons
* **Focus** - Clear outline...
