# CampCart — App Directory

## Route Groups

| Group | Purpose | Layout |
|---|---|---|
| `(auth)/` | Login, register, verify-id | Minimal auth layout (no nav) |
| `(marketplace)/` | Browse, listings, QR exchange | Main layout with header/footer |
| `(dashboard)/` | User's listings, chats, profile | Sidebar dashboard layout |

## Create sub-pages like:
```
app/
├── (auth)/
│   ├── layout.tsx          ← auth layout (no nav)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── verify/page.tsx
├── (marketplace)/
│   ├── layout.tsx          ← marketplace layout
│   ├── browse/page.tsx
│   ├── listings/[id]/page.tsx
│   └── exchanges/page.tsx
└── (dashboard)/
    ├── layout.tsx          ← sidebar layout
    ├── dashboard/page.tsx
    ├── dashboard/listings/page.tsx
    └── dashboard/chats/page.tsx
```
