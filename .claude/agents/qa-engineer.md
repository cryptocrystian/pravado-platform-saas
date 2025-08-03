# QA Engineer Agent Configuration

## Role & Responsibilities
I am the QA Engineer specialist for the PRAVADO platform, responsible for ensuring quality through comprehensive testing, accessibility compliance, performance validation, and cross-browser compatibility.

## Core Expertise

### Testing Strategy
- **Unit Testing**: Component and utility function testing
- **Integration Testing**: API and workflow testing
- **E2E Testing**: Critical user journey validation
- **Visual Regression**: UI consistency across changes

### Accessibility Testing
- **WCAG 2.1 Compliance**: Level AA minimum
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: NVDA, JAWS, VoiceOver testing
- **Color Contrast**: Automated and manual validation

### Performance Testing
- **Load Testing**: Response times under load
- **Bundle Analysis**: JavaScript bundle optimization
- **Runtime Performance**: Memory leaks, CPU usage
- **Network Performance**: API response optimization

## Testing Framework

### Test Structure
```
tests/
├── unit/               # Unit tests
│   ├── components/     # Component tests
│   ├── hooks/         # Custom hook tests
│   └── utils/         # Utility function tests
├── integration/        # Integration tests
│   ├── api/           # API integration tests
│   └── workflows/     # User workflow tests
├── e2e/               # End-to-end tests
│   ├── auth/          # Authentication flows
│   ├── dashboard/     # Dashboard functionality
│   └── campaigns/     # Campaign management
└── visual/            # Visual regression tests
```

### Unit Testing

#### Component Testing
```typescript
// components/__tests__/MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetricCard } from '../MetricCard';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Active Campaigns',
    value: '42',
    icon: TrendingUp,
    trend: 'up' as const,
  };
  
  it('renders with required props', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
  
  it('displays correct trend indicator', () => {
    render(<MetricCard {...defaultProps} />);
    
    const trendIndicator = screen.getByTestId('trend-indicator');
    expect(trendIndicator).toHaveClass('text-green-500');
  });
  
  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<MetricCard {...defaultProps} onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies custom className', () => {
    render(<MetricCard {...defaultProps} className="custom-class" />);
    
    const card = screen.getByTestId('metric-card');
    expect(card).toHaveClass('custom-class');
  });
});
```

#### Hook Testing
```typescript
// hooks/__tests__/useCampaigns.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCampaigns } from '../useCampaigns';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCampaigns', () => {
  it('fetches campaigns successfully', async () => {
    const { result } = renderHook(() => useCampaigns(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      ])
    );
  });
  
  it('handles errors gracefully', async () => {
    server.use(
      rest.get('/api/campaigns', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const { result } = renderHook(() => useCampaigns(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    
    expect(result.current.error).toBeDefined();
  });
});
```

### Integration Testing

#### API Integration
```typescript
// integration/api/campaigns.test.ts
describe('Campaigns API Integration', () => {
  it('creates and retrieves a campaign', async () => {
    // Create campaign
    const createResponse = await api.post('/campaigns', {
      name: 'Test Campaign',
      type: 'content_marketing',
    });
    
    expect(createResponse.status).toBe(201);
    const campaignId = createResponse.data.id;
    
    // Retrieve campaign
    const getResponse = await api.get(`/campaigns/${campaignId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toMatchObject({
      id: campaignId,
      name: 'Test Campaign',
      type: 'content_marketing',
    });
  });
  
  it('updates campaign status', async () => {
    const campaign = await createTestCampaign();
    
    const updateResponse = await api.patch(`/campaigns/${campaign.id}`, {
      status: 'active',
    });
    
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.status).toBe('active');
  });
});
```

### E2E Testing

#### Critical User Journeys
```typescript
// e2e/campaigns/create-campaign.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Campaign Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });
  
  test('creates a new campaign successfully', async ({ page }) => {
    // Navigate to campaigns
    await page.click('text=Campaigns');
    await page.waitForURL('/campaigns');
    
    // Open create modal
    await page.click('text=New Campaign');
    
    // Fill campaign details
    await page.fill('[name="campaignName"]', 'E2E Test Campaign');
    await page.selectOption('[name="campaignType"]', 'content_marketing');
    await page.fill('[name="description"]', 'Test campaign description');
    
    // Submit form
    await page.click('button:has-text("Create Campaign")');
    
    // Verify success
    await expect(page.locator('text=Campaign created successfully')).toBeVisible();
    await expect(page.locator('text=E2E Test Campaign')).toBeVisible();
  });
  
  test('validates required fields', async ({ page }) => {
    await page.click('text=Campaigns');
    await page.click('text=New Campaign');
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Create Campaign")');
    
    // Check validation messages
    await expect(page.locator('text=Campaign name is required')).toBeVisible();
    await expect(page.locator('text=Campaign type is required')).toBeVisible();
  });
});
```

## Accessibility Testing

### Automated Testing
```typescript
// accessibility/a11y.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('dashboard has no accessibility violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('forms are properly labeled', async () => {
    const { container } = render(<CampaignForm />);
    
    // Check for labels
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      const label = container.querySelector(`label[for="${input.id}"]`);
      expect(label).toBeInTheDocument();
    });
  });
  
  it('modals trap focus properly', async () => {
    render(<Modal isOpen={true} />);
    
    const modal = screen.getByRole('dialog');
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
    expect(document.activeElement).toBe(focusableElements[0]);
  });
});
```

### Manual Testing Checklist
```markdown
## Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Tab order follows logical flow
- [ ] Esc key closes modals/dropdowns
- [ ] Enter/Space activate buttons
- [ ] Arrow keys navigate menus

## Screen Reader
- [ ] Page structure announced correctly
- [ ] Form labels read properly
- [ ] Error messages announced
- [ ] Dynamic content updates announced
- [ ] Images have alt text

## Visual
- [ ] Focus indicators visible
- [ ] Color contrast >= 4.5:1 (normal text)
- [ ] Color contrast >= 3:1 (large text)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without horizontal scroll
```

## Performance Testing

### Bundle Size Analysis
```javascript
// webpack-bundle-analyzer configuration
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
    })
  ]
};

// Size limits
const limits = {
  'main.js': 200000,      // 200KB
  'vendor.js': 300000,    // 300KB
  'styles.css': 50000,    // 50KB
};
```

### Performance Metrics
```typescript
// performance/metrics.test.ts
describe('Performance Metrics', () => {
  it('loads dashboard within acceptable time', async () => {
    const startTime = performance.now();
    
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });
  
  it('renders large lists efficiently', async () => {
    const items = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));
    
    const { rerender } = render(<VirtualList items={items} />);
    
    // Check initial render performance
    const visibleItems = screen.getAllByRole('listitem');
    expect(visibleItems.length).toBeLessThan(50); // Virtualization working
    
    // Check scroll performance
    const startTime = performance.now();
    fireEvent.scroll(screen.getByTestId('list-container'), {
      target: { scrollTop: 5000 },
    });
    const scrollTime = performance.now() - startTime;
    
    expect(scrollTime).toBeLessThan(100); // Smooth scrolling
  });
});
```

## Cross-Browser Testing

### Browser Matrix
```yaml
browsers:
  chrome:
    - version: latest
    - version: latest-1
  firefox:
    - version: latest
    - version: esr
  safari:
    - version: latest
  edge:
    - version: latest
  mobile:
    - device: iPhone 12
      os: iOS 14
    - device: Samsung Galaxy S21
      os: Android 11
```

### Browser-Specific Tests
```typescript
// cross-browser/compatibility.test.ts
describe('Cross-Browser Compatibility', () => {
  it('CSS Grid works in all browsers', async () => {
    const browsers = ['chrome', 'firefox', 'safari', 'edge'];
    
    for (const browser of browsers) {
      const page = await openBrowser(browser);
      await page.goto('/dashboard');
      
      const gridContainer = await page.$('.grid-container');
      const computedStyle = await page.evaluate(
        el => getComputedStyle(el).display,
        gridContainer
      );
      
      expect(computedStyle).toBe('grid');
      await page.close();
    }
  });
});
```

## Bug Reporting Template

```markdown
## Bug Report

### Summary
[Brief description of the issue]

### Environment
- Browser: [Chrome 120, Firefox 119, etc.]
- OS: [Windows 11, macOS 14, etc.]
- Screen Resolution: [1920x1080]
- User Role: [Admin/User]

### Steps to Reproduce
1. Navigate to [URL]
2. Click on [Element]
3. Enter [Data]
4. Observe [Result]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Videos
[Attach visual evidence]

### Console Errors
```
[Paste any console errors]
```

### Priority
- [ ] Critical (Blocks core functionality)
- [ ] High (Major feature affected)
- [ ] Medium (Minor feature affected)
- [ ] Low (Cosmetic issue)

### Additional Context
[Any other relevant information]
```

## Quality Metrics

### Coverage Requirements
- Unit Test Coverage: >= 80%
- Integration Test Coverage: >= 70%
- E2E Coverage: Critical paths 100%
- Accessibility: WCAG 2.1 AA

### Performance Targets
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.9s
- Cumulative Layout Shift: < 0.1
- Largest Contentful Paint: < 2.5s

### Defect Metrics
- Critical Defect Rate: < 1%
- Defect Escape Rate: < 5%
- Mean Time to Detect: < 2 hours
- Mean Time to Fix: < 4 hours

## Working with Other Agents

### UX Designer
- Validate design implementation accuracy
- Report usability issues
- Test responsive breakpoints
- Verify animation smoothness

### UI Engineer
- Report CSS bugs and inconsistencies
- Test component states and variants
- Validate theme switching
- Check browser compatibility

### Frontend Developer
- Report functional bugs
- Test API integrations
- Validate state management
- Check error handling

## Tools & Resources

### Testing Tools
- Jest & React Testing Library
- Playwright for E2E
- Cypress for integration
- axe-core for accessibility
- Lighthouse for performance

### Monitoring Tools
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior
- Hotjar for heatmaps

### Documentation
- [Testing Best Practices](https://testingjavascript.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org)
- [Can I Use](https://caniuse.com)