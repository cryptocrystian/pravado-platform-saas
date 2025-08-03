# PRAVADO Motion & Animation Language

## Animation Philosophy

### Design Principles
1. **Purposeful Motion**: Every animation serves a functional purpose
2. **Subtle Enhancement**: Motion enhances without overwhelming
3. **AI-Driven Intelligence**: Animations reflect AI-powered features
4. **Enterprise Polish**: Professional, sophisticated movement
5. **Performance First**: Smooth 60fps animations always

### Motion Personality
- **Intelligent**: Thoughtful, predictive movements
- **Responsive**: Quick feedback to user actions
- **Sophisticated**: Refined, professional animations
- **Helpful**: Guides users through complex workflows
- **Delightful**: Subtle moments of joy and surprise

## Animation Categories

### 1. Micro-interactions
**Purpose**: Immediate feedback for user actions

#### Button Interactions
```css
/* Hover State */
.button:hover {
  transform: scale(1.02);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active State */
.button:active {
  transform: scale(0.98);
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading State */
@keyframes button-loading {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.button-loading {
  animation: button-loading 1s ease-in-out infinite;
}
```

#### Form Feedback
```css
/* Input Focus */
.input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(111, 45, 189, 0.15);
  transition: all 250ms ease-out;
}

/* Validation Success */
@keyframes success-pulse {
  0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(5, 150, 105, 0); }
  100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
}

.input-success {
  animation: success-pulse 600ms ease-out;
}

/* Validation Error */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.input-error {
  animation: error-shake 400ms ease-in-out;
}
```

### 2. Page Transitions
**Purpose**: Smooth navigation between views

#### Route Transitions
```css
/* Page Enter */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: page-enter 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Modal Enter */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter {
  animation: modal-enter 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Drawer Slide */
@keyframes drawer-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-enter {
  animation: drawer-slide-in 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
```

### 3. Loading States
**Purpose**: Indicate system processing and maintain engagement

#### Skeleton Loading
```css
@keyframes skeleton-pulse {
  0% {
    background-color: #f1f5f9;
  }
  50% {
    background-color: #e2e8f0;
  }
  100% {
    background-color: #f1f5f9;
  }
}

.skeleton {
  animation: skeleton-pulse 2s ease-in-out infinite;
  border-radius: 4px;
}

/* Content loading shimmer */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### Progress Indicators
```css
/* Circular Progress */
@keyframes circle-progress {
  0% {
    stroke-dasharray: 0 100;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 100 100;
    stroke-dashoffset: 0;
  }
}

.progress-circle {
  animation: circle-progress 1.5s ease-in-out;
}

/* Linear Progress */
@keyframes progress-bar {
  0% { width: 0%; }
  100% { width: var(--progress-width); }
}

.progress-bar {
  animation: progress-bar 800ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

### 4. AI-Specific Animations
**Purpose**: Communicate AI intelligence and processing

#### AI Thinking Animation
```css
@keyframes ai-thinking {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}

.ai-dot {
  width: 8px;
  height: 8px;
  background: var(--pravado-purple);
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: ai-thinking 1.4s ease-in-out infinite;
}

.ai-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-dot:nth-child(3) { animation-delay: 0.4s; }
```

#### AI Response Typing
```css
@keyframes typing-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.ai-typing::after {
  content: '|';
  animation: typing-cursor 1s infinite;
  color: var(--pravado-purple);
}

/* Streaming text reveal */
@keyframes text-reveal {
  from { width: 0; }
  to { width: 100%; }
}

.ai-stream {
  overflow: hidden;
  white-space: nowrap;
  animation: text-reveal 2s steps(40, end);
}
```

#### AI Glow Effects
```css
@keyframes ai-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(111, 45, 189, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(111, 45, 189, 0.6);
  }
}

.ai-element {
  animation: ai-glow 3s ease-in-out infinite;
}

/* Pulsing border for AI components */
@keyframes ai-border-pulse {
  0% { border-color: rgba(111, 45, 189, 0.3); }
  50% { border-color: rgba(111, 45, 189, 0.8); }
  100% { border-color: rgba(111, 45, 189, 0.3); }
}

.ai-border {
  border: 2px solid transparent;
  animation: ai-border-pulse 2s ease-in-out infinite;
}
```

### 5. Data Visualization
**Purpose**: Animate charts and metrics for better comprehension

#### Chart Animations
```css
/* Bar chart growth */
@keyframes bar-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.chart-bar {
  transform-origin: bottom;
  animation: bar-grow 800ms cubic-bezier(0.25, 0.8, 0.25, 1);
  animation-delay: calc(var(--index) * 100ms);
}

/* Line chart draw */
@keyframes line-draw {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.chart-line {
  stroke-dasharray: 1000;
  animation: line-draw 2s ease-in-out;
}

/* Counter animation */
@keyframes counter-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.metric-value {
  animation: counter-up 600ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

#### Metric Cards
```css
/* Card hover elevation */
.metric-card {
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Trend indicator animation */
@keyframes trend-up {
  0% { transform: translateY(5px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.trend-indicator {
  animation: trend-up 400ms ease-out;
}
```

## Implementation Guidelines

### Performance Standards
```javascript
// Animation performance targets
const ANIMATION_TARGETS = {
  fps: 60,
  maxDuration: 500, // ms
  budgetPerFrame: 16.67, // ms (60fps)
  maxSimultaneous: 5 // concurrent animations
};

// Use transform and opacity for best performance
const PERFORMANT_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
  'clip-path'
];

// Avoid animating these properties
const AVOID_ANIMATING = [
  'width', 'height',
  'padding', 'margin',
  'border-width',
  'top', 'left', 'right', 'bottom'
];
```

### Animation Hooks (React)
```javascript
// Custom hook for entrance animations
import { useEffect, useState } from 'react';

export const useEntranceAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
};

// Usage
const AnimatedComponent = ({ children, delay = 0 }) => {
  const isVisible = useEntranceAnimation(delay);
  
  return (
    <div className={`transition-all duration-500 ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`}>
      {children}
    </div>
  );
};
```

### Framer Motion Variants
```javascript
// Common animation variants
export const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// AI-specific variants
export const aiPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(111, 45, 189, 0.3)",
      "0 0 30px rgba(111, 45, 189, 0.6)",
      "0 0 20px rgba(111, 45, 189, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

## Accessibility Considerations

### Reduced Motion Support
```css
/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Provide alternative feedback for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    opacity: 0.5;
  }
  
  .loading-spinner::after {
    content: 'Loading...';
    display: block;
    text-align: center;
  }
}
```

### Focus Management
```javascript
// Manage focus during animations
const AnimatedModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first focusable element after animation
      setTimeout(() => {
        const firstFocusable = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 300); // After animation completes
    }
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## Animation Timing Reference

### Duration Guidelines
```javascript
const DURATIONS = {
  // Micro-interactions
  hover: 200,
  focus: 150,
  click: 100,
  
  // UI transitions
  tooltip: 200,
  dropdown: 250,
  modal: 300,
  drawer: 350,
  
  // Page transitions
  routeChange: 400,
  tabSwitch: 300,
  
  // Loading states
  skeleton: 2000,
  progress: 800,
  
  // AI animations
  thinking: 1400,
  typing: 2000,
  glow: 3000
};
```

### Easing Functions
```css
/* Custom easing curves */
:root {
  --ease-in-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  
  --ease-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

## Testing & Validation

### Animation Testing Checklist
- [ ] All animations run at 60fps
- [ ] No layout thrashing
- [ ] Reduced motion preferences respected
- [ ] Focus management during animations
- [ ] No unnecessary repaints
- [ ] Smooth on lower-end devices
- [ ] Battery impact minimized
- [ ] Animation states accessible to screen readers

### Performance Monitoring
```javascript
// Monitor animation performance
const monitorAnimationPerformance = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const measureFPS = (currentTime) => {
    frameCount++;
    
    if (currentTime >= lastTime + 1000) {
      const fps = frameCount * 1000 / (currentTime - lastTime);
      console.log(`FPS: ${fps.toFixed(1)}`);
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  };
  
  requestAnimationFrame(measureFPS);
};
```

This motion language ensures PRAVADO maintains a consistent, sophisticated, and performant animation system that enhances the user experience while reflecting the platform's AI-first intelligence.