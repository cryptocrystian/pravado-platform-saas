# PRAVADO Platform Development Context

## Project Overview
PRAVADO is an AI-first marketing intelligence platform with automation-first philosophy: "PRAVADO DRIVES, USER CLICKS"

### Core Philosophy
- **AI-First**: Every feature leverages AI for intelligent automation
- **Automation-First**: Platform operates autonomously, user approves/adjusts
- **Intelligence-Driven**: Real-time insights guide all marketing decisions
- **Enterprise-Grade**: Sophisticated, professional, trustworthy

## Active Specialized Agents

### UX Designer
**Focus**: Design system, visual hierarchy, enterprise aesthetics  
**Context**: [.claude/agents/ux-designer.md](.claude/agents/ux-designer.md)  
**Responsibilities**:
- Sophisticated grayscale depth system
- Dark mode + light mode coordination
- Visual hierarchy and information architecture
- Motion design and micro-interactions

### UI Engineer
**Focus**: Component implementation, CSS architecture, animations  
**Context**: [.claude/agents/ui-engineer.md](.claude/agents/ui-engineer.md)  
**Responsibilities**:
- Tailwind CSS implementation
- Component styling and theming
- Animation implementation
- Responsive design patterns

### Frontend Developer
**Focus**: React integration, performance, API coordination  
**Context**: [.claude/agents/frontend-dev.md](.claude/agents/frontend-dev.md)  
**Responsibilities**:
- React component architecture
- State management (Zustand)
- API integration (Supabase)
- Performance optimization

### QA Engineer
**Focus**: Testing, accessibility, validation  
**Context**: [.claude/agents/qa-engineer.md](.claude/agents/qa-engineer.md)  
**Responsibilities**:
- Component testing
- Accessibility compliance
- Cross-browser compatibility
- Performance validation

## Project Documentation

- **[Complete UX Blueprint](.claude/docs/ux-blueprint.md)** - Comprehensive UX strategy and design principles
- **[Information Architecture](.claude/docs/information-architecture.md)** - Complete screen mapping and navigation flows
- **[Enhanced Design System](.claude/docs/design-system-enhanced.md)** - Sophisticated grayscale system with dark mode
- **[Strategic Implementation Plan](.claude/docs/implementation-plan.md)** - Phased roadmap and technical strategy
- **[Motion & Animation Language](.claude/docs/motion-language.md)** - Animation specifications and interactions

## Current Sprint: Phase 1 Foundation

### Sprint Goals
**GOAL**: Implement sophisticated design system with dark mode + grayscale depth + AI animations  
**STATUS**: Foundation implemented, ready for enhancement

### Completed
- ✅ Sophisticated grayscale depth system implemented
- ✅ Text hierarchy with proper grayscale colors
- ✅ Purple accents on AI components
- ✅ Dark sidebar preserved

### In Progress
- 🔄 Dark mode toggle implementation
- 🔄 AI-powered animations and transitions
- 🔄 Component library refinement
- 🔄 Accessibility enhancements

### Next Steps
1. Implement dark mode toggle with smooth transitions
2. Add AI-powered loading states and animations
3. Enhance component depth and shadows
4. Create motion design system

## Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand for state management
- **Routing**: React Router v6
- **Build**: Vite

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **APIs**: RESTful + Real-time subscriptions
- **AI**: Multiple AI providers (Claude, GPT-4, Gemini)

### Design System
- **Colors**: Sophisticated grayscale + PRAVADO purple accents
- **Typography**: Inter font family
- **Components**: shadcn/ui base with custom enhancements
- **Icons**: Lucide React

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement proper error boundaries
- Maintain consistent file structure

### Component Development
- Build reusable, composable components
- Implement proper prop types and defaults
- Include loading and error states
- Ensure accessibility compliance

### Performance
- Lazy load routes and heavy components
- Optimize images and assets
- Implement proper caching strategies
- Monitor bundle size

### Testing
- Write unit tests for utilities
- Component testing for UI elements
- Integration tests for workflows
- Accessibility testing

## Quick Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript checks
```

### Git Workflow
```bash
git status          # Check current changes
git add .           # Stage all changes
git commit -m ""    # Commit with message
git push            # Push to remote
```

## Important Notes

1. **Always check existing components** before creating new ones
2. **Follow the established design system** for consistency
3. **Test on multiple screen sizes** for responsive design
4. **Ensure accessibility** with proper ARIA labels and keyboard navigation
5. **Use AI features thoughtfully** to enhance user experience

## Contact & Resources

- **Repository**: [pravado-platform-saas](https://github.com/cryptocrystian/pravado-platform-saas)
- **Design System**: Sophisticated grayscale with purple AI accents
- **Documentation**: See .claude/docs/ directory for detailed specs