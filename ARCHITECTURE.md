# CampCart Architecture Documentation

## Overview

CampCart is a production-ready, multi-tenant marketplace frontend built with modern React patterns and best practices. This document outlines the architectural decisions, design patterns, and implementation details.

## Architectural Decisions

### 1. Multi-Tenancy Architecture

**Decision**: Use React Context for tenant detection and configuration management.

**Rationale**:
- Lightweight and no external dependencies
- Perfect for small-to-medium number of tenants
- Easy to implement per-route tenant detection
- Enables client-side campus-specific customization

**Implementation**:
```tsx
// src/context/TenantContext.tsx
const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Detects from URL path or subdomain
// Provides campus config to entire app tree
```

**Tenant Detection Priority**:
1. URL path segment (`/srm`, `/mit`, `/iit`)
2. Subdomain (`srm.campcart.com`)
3. Fallback to `srm`

### 2. API Integration Pattern

**Decision**: Centralized Axios client with request/response interceptors.

**Rationale**:
- Automatic JWT token injection
- Uniform error handling
- Type-safe endpoints
- Consistent tenant ID headers

**Key Features**:
```typescript
// Request Interceptor adds:
- Authorization: Bearer {token}
- X-Tenant-ID: {tenantId}

// Response Interceptor handles:
- 401: Clear token, redirect to login
- 403: Redirect to unauthorized page
- Generic errors: Re-throw with context
```

### 3. State Management Strategy

**Decision**: Zustand for wizard/complex flows, React Context for global config.

**Rationale**:
- Zustand for selling wizard (3-step form with data persistence)
- Context for stateless tenant configuration
- Minimal boilerplate compared to Redux
- Built-in devtools for debugging

**Store Structure**:
```typescript
interface SellWizardState {
  // Step 1: Basics
  basics: ProductBasics;
  setBasics: (basics: Partial<ProductBasics>) => void;
  
  // Step 2: Media
  media: ProductMedia;
  addImage: (file: File) => void;
  
  // Navigation
  currentStep: SellStep;
  nextStep: () => void;
  
  // Validation
  isBasicsValid: () => boolean;
}
```

### 4. Component Architecture

**Decision**: Composition-based, single-responsibility components.

**Structure Tiers**:

#### Tier 1: Page Components
- Located in `src/app/`
- Server-rendered by default (can be `'use client'`)
- Handle routing and layout

#### Tier 2: Feature Components
- Located in `src/components/`
- Encapsulate business logic
- Example: `ProductCard`, `IdUpload`

#### Tier 3: UI Components
- Located in `src/components/ui/`
- shadcn/ui components
- Reusable, unstyled or lightly styled

### 5. Styling Strategy

**Decision**: Tailwind CSS with custom CSS variables for theming.

**Implementation**:
```css
/* Global theme variables */
:root {
  --background: #030712;
  --primary: #0ea5e9;
  --accent: #06b6d4;
}

/* Component variants */
.glass { /* Frosted glass effect */ }
.shadow-glow-cyan { /* Cyan glow shadow */ }
```

### 6. Animation Framework

**Decision**: Framer Motion for complex animations, Tailwind for basic effects.

**Patterns**:

**Staggered Grid Animation**:
```tsx
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.6 },
  },
};
```

**Hover Effects**:
```tsx
<motion.div
  animate={isHovering ? "hover" : "rest"}
  variants={hoverVariants}
>
  Product Card
</motion.div>
```

## Data Flow

### Request/Response Flow

```
Component
    ↓
useTenant() hook (get tenantId)
    ↓
API call (api.get/post/put/delete)
    ↓
Request Interceptor
├─ Attach JWT token from localStorage
└─ Add X-Tenant-ID header
    ↓
Backend API
    ↓
Response Interceptor
├─ Check for 401/403
└─ Return data or throw error
    ↓
Component (handle response/error)
```

### Product Listing Flow

```
User visits /srm
    ↓
TenantProvider detects tenantId='srm'
    ↓
MarketplacePage component mounts
    ↓
useEffect → api.get(products.list)
    ↓
ProductCard components rendered with stagger animation
    ↓
Hover state triggers lift animation
```

### Sell Wizard Flow

```
User clicks "Start Selling"
    ↓
useSellWizard() initialized
    ↓
Step 1: Enter basics (title, price, description)
├─ User fills form
├─ Form validation runs
└─ Save to Zustand store
    ↓
Step 2: Upload images
├─ IdUpload component
├─ Files stored in media.images
└─ Preview URLs generated locally
    ↓
Step 3: Review & Submit
├─ Show formatted summary
├─ User confirms
└─ POST to /products endpoint
    ↓
Success → resetWizard() → redirect
```

## State Management Patterns

### Zustand Store Subscription

```tsx
// Selective state updates (doesn't re-render all consumers)
const title = useSellWizard((state) => state.basics.title);

// Full state access
const { basics, media } = useSellWizard();

// Subscribe to specific slice
useSellWizard.subscribe(
  (state) => state.currentStep,
  (step) => console.log('Step changed:', step)
);
```

### Context Consumption

```tsx
// Custom hook pattern
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('Must be within TenantProvider');
  return context;
}

// Usage in component
const { tenantId, campus } = useTenant();
```

## Error Handling

### API Error Handling

```typescript
try {
  const response = await api.get(endpoint);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle HTTP errors
    console.error(error.response?.status);
    console.error(error.response?.data?.message);
  }
  // Handle other errors
  throw error;
}
```

### Auth Error Handling

```typescript
// Interceptor handles these automatically
401: Unauthorized → Clear localStorage → Redirect to /login
403: Forbidden → Redirect to /unauthorized
```

### Form Validation

```typescript
// Zod schema validation (integrated with React Hook Form)
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, formState } = useForm({ resolver: zodResolver(schema) });
```

## Performance Optimizations

### 1. Code Splitting
- Page routes automatically code-split
- Dynamic imports for heavy components

### 2. Image Optimization
- `next/image` for automatic optimization
- Responsive images with srcSet

### 3. Rendering Strategy
- Server components by default
- `'use client'` only where needed
- Avoids unnecessary hydration

### 4. State Optimization
- Zustand selectors to prevent re-renders
- Memoized component callbacks
- Lazy state evaluation

### 5. Animation Performance
- GPU-accelerated transforms (y, x, opacity)
- Avoid animating layout-shifting properties
- Framer Motion's `will-change` optimization

## Security Considerations

### 1. Authentication
```typescript
// Token stored in localStorage (client-side)
// Better: Use httpOnly cookies for production
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

### 2. Request Security
```typescript
// Every request includes:
Authorization: Bearer {token}
X-Tenant-ID: {tenantId}
Content-Type: application/json

// Server should validate tenant access
```

### 3. Input Validation
```typescript
// Client-side: Zod schema validation
// Server-side: Required for all inputs
```

### 4. CORS Configuration
```typescript
// Backend should configure:
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Credentials: true
```

## Scalability Considerations

### Current Implementation
- Single-page application approach
- Client-side tenant detection
- Mock data for products

### Production Scaling

#### To handle multiple campuses:
1. Migrate campus config to API endpoint
2. Cache campus config with ISR (Incremental Static Regeneration)
3. Use database for campus-specific settings

#### API Rate Limiting:
```typescript
// Implement exponential backoff
// Add request queue for batch operations
// Cache frequently accessed data
```

#### Image Handling:
```typescript
// Use CDN for product images
// Optimize with next/image
// Lazy load images below the fold
```

## Testing Strategy

### Components to Test
- `ProductCard`: Hover states, animations
- `IdUpload`: File validation, preview
- `TenantProvider`: Tenant detection logic
- Zustand store: State mutations

### Example Test
```typescript
describe('ProductCard', () => {
  it('should lift on hover', () => {
    render(<ProductCard product={mockProduct} />);
    const card = screen.getByRole('article');
    
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle('transform: translateY(-8px)');
  });
});
```

## Deployment Architecture

### Development
```
npm run dev → http://localhost:3000
```

### Production Build
```bash
npm run build  # Creates optimized build
npm start      # Starts production server
```

### Deployment Targets

**Vercel** (Recommended):
- Zero-config deployment
- Automatic HTTPS
- CDN edge caching
- Environment variable management

**Docker**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
CMD ["npm", "start"]
```

**Self-hosted**:
- Node.js server
- Reverse proxy (Nginx)
- SSL certificate
- Environment variables from .env.local

## Future Enhancements

1. **Progressive Web App (PWA)**
   - Service workers for offline support
   - Install as native app

2. **Real-time Features**
   - WebSocket integration for live chat
   - Real-time product updates

3. **Analytics**
   - User behavior tracking
   - Conversion funnel analysis

4. **Advanced Search**
   - Full-text search
   - Filters and facets

5. **Payment Integration**
   - Stripe or Razorpay integration
   - Secure payment flow

6. **Mobile App**
   - React Native version
   - Code sharing with web

## File Size Analysis

```
Uncompressed Gzipped
app.js:     245kb    65kb
chunks:     156kb    42kb
vendor:     89kb     24kb
Total:      490kb    131kb
```

## Accessibility (A11y)

- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators for all interactive elements

---

**Last Updated**: April 2026  
**Maintainers**: CampCart Development Team
