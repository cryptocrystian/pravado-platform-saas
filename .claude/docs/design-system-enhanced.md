# PRAVADO Enhanced Design System

## Sophisticated Grayscale Depth System

### Design Philosophy
Create visual depth through layered grayscale tones, avoiding stark white backgrounds while maintaining excellent readability and professional aesthetics.

### Color Palette

#### Grayscale Foundation
```css
/* Light Mode Grayscale */
--gray-50:  #f8fafc;  /* Main cards - very light gray */
--gray-100: #f1f5f9;  /* Page background - slightly darker */
--gray-200: #e2e8f0;  /* Borders, dividers - subtle gray */
--gray-300: #cbd5e1;  /* Disabled states */
--gray-400: #94a3b8;  /* Placeholder text */
--gray-500: #64748b;  /* Muted text */
--gray-600: #475569;  /* Secondary text */
--gray-700: #334155;  /* Body text */
--gray-800: #1e293b;  /* Headings - dark gray */
--gray-900: #0f172a;  /* Darkest elements */

/* Dark Mode Grayscale */
--dark-bg:     #0f172a;  /* Main background */
--dark-card:   #1e293b;  /* Card background */
--dark-raised: #334155;  /* Elevated surfaces */
--dark-border: #475569;  /* Borders */
--dark-text:   #f1f5f9;  /* Primary text */
--dark-muted:  #cbd5e1;  /* Secondary text */
```

#### Accent Colors
```css
/* AI & Innovation */
--pravado-purple:      #6f2dbd;  /* Primary AI accent */
--pravado-purple-dark: #5a249d;  /* Hover state */
--pravado-purple-light:#8b4dd8;  /* Light variant */
--pravado-purple-bg:   #6f2dbd10; /* 10% opacity background */

/* Action & Urgency */
--pravado-crimson:      #c3073f;  /* CTAs, alerts */
--pravado-crimson-dark: #a00535;  /* Hover state */
--pravado-crimson-light:#d41850;  /* Light variant */

/* Trust & Stability */
--enterprise-blue:      #1e40af;  /* Links, info */
--enterprise-blue-dark: #1e3a8a;  /* Hover state */
--enterprise-blue-light:#3b82f6;  /* Light variant */

/* Status Colors */
--success-green: #059669;  /* Success states */
--warning-amber: #f59e0b;  /* Warnings */
--error-red:     #dc2626;  /* Errors */
--info-blue:     #0ea5e9;  /* Information */
```

### Layering System

#### Z-Index Hierarchy
```css
/* Elevation Levels */
--z-base:      0;     /* Base level */
--z-raised:    10;    /* Cards, panels */
--z-overlay:   20;    /* Dropdowns, tooltips */
--z-modal:     30;    /* Modals, dialogs */
--z-popover:   40;    /* Popovers, menus */
--z-toast:     50;    /* Notifications */
--z-tooltip:   60;    /* Tooltips */
--z-max:       9999;  /* Maximum level */
```

#### Shadow System
```css
/* Sophisticated Shadow Scale */
--shadow-xs:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm:   0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Colored Shadows for Emphasis */
--shadow-purple: 0 10px 40px -10px rgba(111, 45, 189, 0.3);
--shadow-crimson: 0 10px 40px -10px rgba(195, 7, 63, 0.3);
```

### Typography System

#### Font Family
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

#### Type Scale
```css
/* Headings */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */

/* Line Heights */
--leading-tight:   1.25;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
--leading-loose:   2;

/* Font Weights */
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
--font-extrabold:800;
```

#### Text Color Hierarchy
```css
/* Light Mode Text */
.text-primary   { color: var(--gray-800); }  /* Headings */
.text-secondary { color: var(--gray-600); }  /* Body text */
.text-muted     { color: var(--gray-500); }  /* Captions */
.text-disabled  { color: var(--gray-400); }  /* Disabled */

/* Dark Mode Text */
.dark .text-primary   { color: var(--gray-100); }
.dark .text-secondary { color: var(--gray-300); }
.dark .text-muted     { color: var(--gray-400); }
.dark .text-disabled  { color: var(--gray-500); }
```

### Component Styles

#### Cards
```css
/* Light Mode Card */
.card {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Dark Mode Card */
.dark .card {
  background: var(--dark-card);
  border-color: var(--dark-border);
}

/* Elevated Card Variant */
.card-elevated {
  background: white;
  box-shadow: var(--shadow-lg);
}

.dark .card-elevated {
  background: var(--dark-raised);
}
```

#### Buttons
```css
/* Primary Button - Purple Gradient */
.btn-primary {
  background: linear-gradient(135deg, var(--pravado-purple) 0%, var(--pravado-purple-dark) 100%);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: var(--shadow-purple);
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary Button - Gray */
.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--gray-200);
  border-color: var(--gray-300);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-800);
}
```

#### Forms
```css
/* Input Fields */
.input {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-size: var(--text-base);
  color: var(--gray-800);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--pravado-purple);
  box-shadow: 0 0 0 3px var(--pravado-purple-bg);
}

.dark .input {
  background: var(--dark-raised);
  border-color: var(--dark-border);
  color: var(--dark-text);
}

/* Select Dropdown */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
```

### Animation & Motion

#### Transition Timing
```css
--transition-fast:   150ms;
--transition-base:   250ms;
--transition-slow:   350ms;
--transition-slower: 500ms;

/* Easing Functions */
--ease-linear:  linear;
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### AI Animation Classes
```css
/* Pulse Glow for AI Elements */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(111, 45, 189, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(111, 45, 189, 0.5);
  }
}

.ai-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Typing Animation for AI Responses */
@keyframes typing {
  0% { width: 0; }
  100% { width: 100%; }
}

.ai-typing {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
}

/* Loading Dots for AI Processing */
@keyframes dot-pulse {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}

.ai-loading-dot {
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.ai-loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}
```

### Dark Mode Implementation

#### Toggle Mechanism
```javascript
// Theme toggle logic
const toggleTheme = () => {
  const html = document.documentElement;
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.classList.remove(currentTheme);
  html.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
};

// Auto-detect system preference
const getPreferredTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};
```

#### Theme Variables
```css
/* CSS Variables that change with theme */
:root {
  --bg-primary: var(--gray-100);
  --bg-secondary: var(--gray-50);
  --text-primary: var(--gray-800);
  --text-secondary: var(--gray-600);
  --border-color: var(--gray-200);
}

.dark {
  --bg-primary: var(--dark-bg);
  --bg-secondary: var(--dark-card);
  --text-primary: var(--dark-text);
  --text-secondary: var(--dark-muted);
  --border-color: var(--dark-border);
}
```

### Responsive Design

#### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Wide desktop */
--screen-2xl: 1536px; /* Ultra-wide */
```

#### Container Widths
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### Accessibility

#### Focus States
```css
/* Visible focus for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--pravado-purple);
  outline-offset: 2px;
}

/* Remove focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

#### Color Contrast Requirements
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum
- Disabled elements: No requirement but should be visually distinct

#### Motion Preferences
```css
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Implementation Guidelines

1. **Always use the grayscale depth system** - No pure white backgrounds
2. **Purple accents for AI features only** - Maintain brand association
3. **Consistent shadow usage** - Light shadows for subtle depth
4. **Smooth transitions** - All interactive elements should transition
5. **Dark mode parity** - Every component must work in both themes
6. **Mobile-first approach** - Design for mobile, enhance for desktop
7. **Accessibility first** - Never sacrifice accessibility for aesthetics