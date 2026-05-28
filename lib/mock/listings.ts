import {
  ListingCategory,
  ListingStatus,
  ProductCondition,
} from "@/types/enums";
import type { ListingPreview, Listing } from "@/types/listing";

/**
 * CampCart Mock Listings
 * Generates realistic student marketplace items for development testing.
 */

const MOCK_SELLERS = [
  {
    id: "seller-1",
    name: "Aditya K.",
    college: "SRM IST Chennai",
    rating: 4.8,
    totalSales: 12,
    isVerified: true,
  },
  {
    id: "seller-2",
    name: "Priya S.",
    college: "SRM IST Chennai",
    rating: 5.0,
    totalSales: 3,
    isVerified: true,
  },
  {
    id: "seller-3",
    name: "Rahul M.",
    college: "SRM IST Chennai",
    rating: 4.5,
    totalSales: 8,
    isVerified: false,
  },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "item-101",
    slug: "engineering-mathematics-vol-2-101",
    title: "Engineering Mathematics Vol. 2 (Grewal)",
    description: `Slightly used but in great condition. No torn pages, no highlights inside. 

I used this for my 2nd semester Engineering Mathematics course and it covers everything you need for the exams. The cover has a slight bend on the corner but otherwise it's perfect.

Topics covered include:
- Differential Equations
- Vector Calculus
- Complex Analysis

Selling because I've completed the course and need to buy 3rd-year textbooks.`,
    price: 350,
    originalPrice: 850,
    negotiable: false,
    category: ListingCategory.BOOKS,
    condition: ProductCondition.GOOD,
    status: ListingStatus.ACTIVE,
    department: "Common",
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
        alt: "Engineering Math Book - Front Cover",
        isPrimary: true,
      },
      {
        id: "img-1-2",
        url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
        alt: "Engineering Math Book - Inside Pages",
        isPrimary: false,
      },
      {
        id: "img-1-3",
        url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
        alt: "Engineering Math Book - Back Cover",
        isPrimary: false,
      },
    ],
    seller: MOCK_SELLERS[0]!,
    tags: ["math", "textbook", "1st-year"],
    views: 45,
    saves: 12,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "item-102",
    slug: "casio-fx-991es-plus-102",
    title: "Casio FX-991ES Plus Scientific Calculator",
    description: `Works perfectly. Screen has no scratches. Upgraded to a programmable calc for my current semester.

Comes with the original slide-on hard case. 
Features:
- 417 Functions
- Natural Textbook Display
- Solar powered with battery backup

Cash only. Willing to meet near the main library.`,
    price: 600,
    originalPrice: 1200,
    negotiable: true,
    category: ListingCategory.CALCULATORS,
    condition: ProductCondition.LIKE_NEW,
    status: ListingStatus.ACTIVE,
    department: "Common",
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1574607383471-2947118ed3b6?q=80&w=600&auto=format&fit=crop",
        alt: "Casio Calculator - Front",
        isPrimary: true,
      },
      {
        id: "img-2-2",
        url: "https://images.unsplash.com/photo-1611078759560-6b610c3c6ef1?q=80&w=600&auto=format&fit=crop",
        alt: "Casio Calculator - Screen On",
        isPrimary: false,
      },
    ],
    seller: MOCK_SELLERS[1]!,
    tags: ["casio", "calculator", "electronics"],
    views: 120,
    saves: 34,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "item-103",
    slug: "white-lab-coat-medium-103",
    title: "White Chemistry Lab Coat (Medium)",
    description: "Washed and clean. Used for only one semester.",
    price: 150,
    originalPrice: 350,
    negotiable: false,
    category: ListingCategory.LAB_MATERIALS,
    condition: ProductCondition.GOOD,
    status: ListingStatus.RESERVED,
    department: "Chemistry",
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1628148906963-71887eec8675?q=80&w=600&auto=format&fit=crop",
        alt: "Lab Coat",
        isPrimary: true,
      },
    ],
    seller: MOCK_SELLERS[2]!,
    tags: ["lab", "coat", "chemistry"],
    views: 89,
    saves: 5,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "item-104",
    slug: "arduino-uno-starter-kit-104",
    title: "Arduino Uno R3 Starter Kit",
    description: "Complete kit with breadboard, LEDs, and jumper wires. Selling because my project is over.",
    price: 800,
    originalPrice: 1500,
    negotiable: true,
    category: ListingCategory.ELECTRONICS,
    condition: ProductCondition.LIKE_NEW,
    status: ListingStatus.SOLD,
    department: "Electronics",
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?q=80&w=600&auto=format&fit=crop",
        alt: "Arduino Uno",
        isPrimary: true,
      },
    ],
    seller: MOCK_SELLERS[0]!,
    tags: ["arduino", "electronics", "microcontroller"],
    views: 200,
    saves: 45,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "item-105",
    slug: "data-structures-notes-105",
    title: "Handwritten DSA Notes (C++)",
    description: "Detailed notes covering arrays, linked lists, trees, and graphs. Neat handwriting.",
    price: 50,
    negotiable: false,
    category: ListingCategory.NOTES,
    condition: ProductCondition.GOOD,
    status: ListingStatus.ACTIVE,
    department: "Computer Science",
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=600&auto=format&fit=crop",
        alt: "Handwritten Notes",
        isPrimary: true,
      },
    ],
    seller: MOCK_SELLERS[1]!,
    tags: ["notes", "dsa", "cse"],
    views: 310,
    saves: 85,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "item-106",
    slug: "drafting-mini-drapter-106",
    title: "Mini Drafter for Engineering Drawing",
    description: "Omega brand mini drafter with cover. Perfect condition.",
    price: 200,
    originalPrice: 400,
    negotiable: false,
    category: ListingCategory.STATIONERY,
    condition: ProductCondition.LIKE_NEW,
    status: ListingStatus.ACTIVE,
    department: "Mechanical",
    images: [
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=600&auto=format&fit=crop",
        alt: "Mini Drafter",
        isPrimary: true,
      },
    ],
    seller: MOCK_SELLERS[2]!,
    tags: ["drawing", "drafter", "mechanical"],
    views: 65,
    saves: 8,
    campus: "SRM IST Chennai",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

/**
 * Returns a subset of Listing tailored for the preview grid
 */
export const MOCK_LISTING_PREVIEWS: ListingPreview[] = MOCK_LISTINGS.map((listing) => ({
  id: listing.id,
  slug: listing.slug,
  title: listing.title,
  price: listing.price,
  originalPrice: listing.originalPrice,
  category: listing.category,
  condition: listing.condition,
  status: listing.status,
  images: listing.images,
  saves: listing.saves,
  createdAt: listing.createdAt,
  seller: {
    id: listing.seller.id,
    name: listing.seller.name,
    isVerified: listing.seller.isVerified,
    rating: listing.seller.rating,
  },
}));
