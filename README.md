# 🎬 CampCart - A Cinematic Multi-Tenant Marketplace

A production-ready, high-end frontend for a college campus marketplace where students buy and sell items securely. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## ✨ Features

### Multi-Tenancy Support
- **Dynamic Tenant Detection**: Automatically detects campus from URL (e.g., `/srm`, `/mit`, `/iit`)
- **Tenant Context Provider**: Centralized campus configuration management
- **Automatic Header Injection**: All API calls include tenant ID in headers

### Authentication & Verification
- **Student ID Upload**: Drag-and-drop file upload with real-time preview
- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Injection**: Request interceptors attach Bearer tokens automatically

### Product Marketplace
- **Cinematic Hero Section**: Animated gradient backgrounds and staggered content
- **Product Grid**: Responsive 3-column grid with hover animations
- **Product Cards**: Premium hover states with lift effects and custom shadows
- **Search Functionality**: Real-time product and seller filtering

### State Management
- **3-Step Sell Wizard**: Basics → Media → Review with zero data loss
- **Persistent Store**: Zustand with devtools for debugging

## 🛠 Tech Stack

- **Next.js 15** - App Router, Server Components ready
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **shadcn/ui** - Component library

## 🚀 Getting Started

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── globals.css                # Global styles & theme
│   └── (marketplace)/
│       └── [tenantId]/
│           └── page.tsx           # Main marketplace page
├── components/
│   ├── ProductCard.tsx            # Product card component
│   └── auth/
│       └── IdUpload.tsx           # ID upload component
├── context/
│   └── TenantContext.tsx          # Multi-tenancy provider
├── lib/
│   └── api.ts                     # Axios client & endpoints
├── store/
│   └── sellWizard.ts              # Zustand store
└── types/
    └── tenant.ts                  # TypeScript types
```

## 🏗 Architecture

### Multi-Tenancy
The TenantProvider automatically detects campus from URL and provides configuration to the entire app.

```tsx
import { useTenant } from '@/context/TenantContext';

const { tenantId, campus } = useTenant();
```

### API Integration
All API calls automatically include JWT token and tenant ID headers.

```tsx
import { api, apiEndpoints } from '@/lib/api';

const products = await api.get(apiEndpoints.products.list);
```

### State Management
Zustand store for the product selling wizard with persistent state.

```tsx
import { useSellWizard } from '@/store/sellWizard';

const { basics, setBasics, nextStep } = useSellWizard();
```

## 🎨 Styling & Animations

- **Dark Cinematic Theme**: High-end aesthetic with cyan/blue accents
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Framer Motion**: Staggered entries, hover effects, and smooth transitions
- **Shimmer Skeletons**: Loading states for optimal perceived performance

## 📦 Key Components

### ProductCard
Premium product listing with hover animations and lift effects.

### IdUpload
Drag-and-drop file upload with real-time preview and validation.

### SellWizard
3-step product creation flow with form validation and state persistence.

## 🔧 Configuration

### Environment Variables
Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Campus Configuration
Edit `src/context/TenantContext.tsx` to add more campuses.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

**Built with ❤️ for college campuses everywhere**
