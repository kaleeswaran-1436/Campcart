# CampCart Development Guide

## Quick Start

```bash
# 1. Navigate to project
cd campcart

# 2. Install dependencies (if needed)
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
# http://localhost:3000
```

## Common Development Tasks

### Adding a New Campus

1. **Update TenantContext.tsx**:
```typescript
// src/context/TenantContext.tsx
const CAMPUS_CONFIG: Record<string, Campus> = {
  // ... existing campuses
  vit: {
    id: 'vit',
    name: 'Vellore Institute of Technology',
    domain: 'vit.campcart.com',
    logo: 'https://...',
    primaryColor: '#1a1f3a',
    secondaryColor: '#2d3561',
    accentColor: '#00d4ff',
  },
};
```

2. **Test**:
```
# Accessing: http://localhost:3000/vit
# Should load with VIT campus config
```

### Creating a New API Endpoint

1. **Add to api.ts**:
```typescript
// src/lib/api.ts
export const apiEndpoints = {
  // ... existing
  reviews: {
    list: '/reviews',
    create: '/reviews',
    getOne: (id: string) => `/reviews/${id}`,
  },
};
```

2. **Use in component**:
```typescript
import { api, apiEndpoints } from '@/lib/api';

const reviews = await api.get(apiEndpoints.reviews.list);
```

### Adding a New Component Page

1. **Create directory**:
```bash
mkdir src/app/(marketplace)/[tenantId]/products/[productId]
```

2. **Create page.tsx**:
```typescript
'use client';

import { useTenant } from '@/context/TenantContext';

export default function ProductPage({ 
  params 
}: { 
  params: Promise<{ tenantId: string; productId: string }> 
}) {
  const { campus } = useTenant();
  
  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <h1>{campus?.name} - Product Details</h1>
    </main>
  );
}
```

### Working with the Sell Wizard

```typescript
'use client';

import { useSellWizard } from '@/store/sellWizard';
import { IdUpload } from '@/components/auth/IdUpload';

export default function SellPage() {
  const {
    currentStep,
    basics,
    media,
    setBasics,
    addImage,
    nextStep,
    previousStep,
    isBasicsValid,
  } = useSellWizard();

  return (
    <div>
      {currentStep === 'basics' && (
        <div>
          <input
            placeholder="Product title"
            value={basics.title}
            onChange={(e) => setBasics({ title: e.target.value })}
          />
          <button onClick={nextStep} disabled={!isBasicsValid()}>
            Next
          </button>
        </div>
      )}

      {currentStep === 'media' && (
        <div>
          <IdUpload onImageSelect={addImage} />
          <div className="flex gap-4">
            <button onClick={previousStep}>Back</button>
            <button onClick={nextStep} disabled={media.images.length === 0}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Making API Requests with Error Handling

```typescript
import { api, apiEndpoints } from '@/lib/api';
import { useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(apiEndpoints.products.list);
      setProducts(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load products'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {products.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
      <button onClick={loadProducts}>Refresh</button>
    </div>
  );
}
```

### Adding Animations with Framer Motion

```typescript
import { motion } from 'framer-motion';

export function AnimatedCard() {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-gray-800 p-6 rounded-lg"
    >
      <h2>Animated Card</h2>
    </motion.div>
  );
}
```

### Styling with Glassmorphism

```tsx
/* Apply via className */
<div className="glass">
  {/* Frosted glass effect - white/10 bg with backdrop blur */}
</div>

<div className="glass-dark">
  {/* Dark variant - gray-900/40 */}
</div>

/* Custom shadow glow */
<div className="shadow-glow-cyan">
  {/* Cyan glow effect */}
</div>
```

### File Upload Handling

```typescript
import { IdUpload } from '@/components/auth/IdUpload';
import { api, apiEndpoints } from '@/lib/api';
import { useState } from 'react';

export function IdVerificationFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleImageSelect = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(
        apiEndpoints.auth.uploadId,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPreview(response.data.previewUrl);
      console.log('Upload successful:', response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to upload ID'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IdUpload
      onImageSelect={handleImageSelect}
      preview={preview}
      loading={loading}
      error={error}
    />
  );
}
```

## Debugging

### Zustand Store Devtools

The store is automatically integrated with Zustand devtools:

```bash
# Install Zustand devtools browser extension
# Then inspect store state and actions in browser devtools
```

### Console Logging

```typescript
// Log tenantId on mount
const { tenantId } = useTenant();
useEffect(() => {
  console.log('Current tenant:', tenantId);
}, [tenantId]);

// Log store state
const state = useSellWizard.getState();
console.log('Wizard state:', state);
```

### Network Debugging

1. Open DevTools → Network tab
2. Check request headers:
   - `Authorization: Bearer ...`
   - `X-Tenant-ID: ...`
3. Verify response status and data

## Performance Tips

### 1. Component Memoization
```typescript
import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product }: Props) {
  return <div>{product.title}</div>;
});
```

### 2. Selective State Subscription
```typescript
// Only re-render when currentStep changes
const currentStep = useSellWizard((state) => state.currentStep);

// Instead of:
const { currentStep } = useSellWizard();
```

### 3. Lazy Loading Images
```typescript
<Image
  src={url}
  alt="product"
  loading="lazy"
  width={300}
  height={300}
/>
```

### 4. Dynamic Imports
```typescript
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <LoadingSpinner />,
});
```

## Testing

### Running Tests
```bash
# Jest (if configured)
npm test

# With coverage
npm test -- --coverage
```

### Example Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = { id: '1', title: 'Test Product', price: 1000 };
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('shows favorite toggle', () => {
    const product = { id: '1', title: 'Test' };
    render(<ProductCard product={product} />);
    
    const favButton = screen.getByRole('button', { name: /favorite/ });
    fireEvent.click(favButton);
    expect(favButton).toHaveAttribute('data-favorited', 'true');
  });
});
```

## Building & Deployment

### Production Build
```bash
npm run build

# Creates optimized bundle in .next/
# ~130kb gzipped total
```

### Local Production Testing
```bash
npm run build
npm start
# http://localhost:3000
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel

# Create GitHub account
# Connect repository
# Auto-deploys on push
```

## Environment Variables

### Development (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Production (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.campcart.com/api
```

## Troubleshooting

### Dev Server Won't Start
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Module Not Found
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm install
```

### Animations Janky
- Check if you're animating layout properties
- Use `will-change: transform` in CSS
- Profile with DevTools Performance tab

### API Requests Failing
- Check CORS headers from backend
- Verify token in localStorage
- Check X-Tenant-ID header
- Inspect network tab for errors

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

---

Made with ❤️ for developers
