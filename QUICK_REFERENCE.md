# Quick Reference Guide

**Los Santos Real Estate Management Platform - Feature Usage**

---

## 🎯 Navigation

### View Buyer Dashboard
```
Route: /buyer-dashboard
Protected: Yes (requires user role)
Location: client/pages/BuyerDashboard.tsx
```

### Access User Settings
```
Route: /user-settings
Protected: Yes
Features: Dark mode toggle, logout, preferences
Location: client/pages/UserSettings.tsx
```

### Welcome Page
```
Route: /welcome
No protection
Destination after logout
```

---

## 🏠 BuyerDashboard Features

### Filter Properties

```tsx
// Hook for all filters (provides debouncing automatically)
const filters = usePropertyFilters();

// Individual filters available:
filters.priceFilter        // Min/max price with 300ms debounce
filters.typeFilter         // Property type checkboxes
filters.searchFilter       // Search input (500ms debounce)
filters.locationFilter     // Location selection

// Access debounced values for filtering
const filtered = properties.filter(p => 
  p.price >= filters.priceFilter.debouncedMinPrice &&
  p.price <= filters.priceFilter.debouncedMaxPrice
);
```

### Property Grid Responsive

```tsx
// Automatically scales based on screen:
// - 360px (xs): 1 column
// - 640px (sm): 1 column  
// - 768px (md): 2 columns
// - 1024px (lg): 3 columns
// - 1920px (3xl): 4 columns
// - 2560px (4xl): 5 columns
// - 3840px (5xl): 6 columns

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 gap-6">
  {properties.map(prop => <PropertyCard key={prop.id} {...prop} />)}
</div>
```

### Toggle Favorites

```tsx
const [favorites, setFavorites] = useState<string[]>([]);

const handleFavorite = (id: string) => {
  setFavorites(prev => 
    prev.includes(id) 
      ? prev.filter(fav => fav !== id) 
      : [...prev, id]
  );
};

// Use in PropertyCard
<Heart 
  fill={favorites.includes(id) ? "currentColor" : "none"}
  onClick={() => handleFavorite(id)}
/>
```

---

## 🎨 Dark Mode

### Use Dark Mode Hook

```tsx
import { useDarkMode } from "@/lib/dark-mode-context";

export function MyComponent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className={isDarkMode ? "bg-gray-900" : "bg-white"}>
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

### Dark Mode Tailwind Classes

```tsx
// Automatic dark mode variants
<div className="bg-white dark:bg-gray-900">
  {/* Light mode: white, Dark mode: gray-900 */}
</div>

<p className="text-gray-700 dark:text-gray-300">
  {/* Light mode: dark gray, Dark mode: light gray */}
</p>
```

### Check Current Preference

```tsx
const { isDarkMode } = useDarkMode();

// In settings or preferences
<input 
  type="checkbox" 
  checked={isDarkMode}
  onChange={toggleDarkMode}
/>
```

---

## 👤 User Context

### Access User Profile

```tsx
import { useUserContext } from "@/lib/user-context";

export function ProfileCard() {
  const { userProfile, role } = useUserContext();
  
  return (
    <div>
      <h1>{userProfile?.name}</h1>
      <p>Role: {role}</p>
      <p>Email: {userProfile?.email}</p>
    </div>
  );
}
```

### Update User Role

```tsx
const { updateUserProfile } = useUserContext();

// Buyer role
updateUserProfile({ role: "buyer" });

// Seller role
updateUserProfile({ role: "seller" });
```

### Logout

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
const handleLogout = () => {
  localStorage.clear();
  navigate("/welcome");
};
```

---

## 🖼️ Images

### Use Property Images

```tsx
import { getPropertyImages, getRandomPropertyImage } from "@/lib/image-service";

// Random image for display
const randomImage = getRandomPropertyImage();

// Images by type
const apartmentImages = getImagesByPropertyType("apartment");

// Get hero image (full-width optimized)
const heroImage = getHeroImageUrl(imageUrl);

// Get thumbnail (300px)
const thumb = getThumbnailUrl(imageUrl);

// Generate responsive srcset
const srcset = generateSrcSet(imageUrl);
```

### Image in Component

```tsx
<img
  src={propertyImage}
  alt="Property"
  loading="lazy"  // Native lazy loading
  srcSet={generateSrcSet(propertyImage)}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="w-full h-48 object-cover"
/>
```

### Preload Images

```tsx
import { preloadImages } from "@/lib/performance";

useEffect(() => {
  const urls = properties.map(p => p.image);
  preloadImages(urls);
}, [properties]);
```

---

## ⚡ Performance

### Debounce Function

```tsx
import { debounce } from "@/lib/performance";

const handleSearch = debounce((term: string) => {
  // This runs 500ms after user stops typing
  setSearchResults(term);
}, 500);

<input onChange={(e) => handleSearch(e.target.value)} />
```

### Memoize Expensive Calculation

```tsx
import { memoize } from "@/lib/performance";

const calculateStats = memoize((properties) => {
  // Expensive calculation
  return stats;
});

// Cached results, returns same reference if input unchanged
const stats = calculateStats(properties);
```

### Lazy Loader for Scroll Events

```tsx
import { createLazyLoader } from "@/lib/performance";

const lazyLoader = createLazyLoader((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreProperties(entry.target);
    }
  });
});

// Observe elements
document.querySelectorAll('[data-lazy]').forEach(el => {
  lazyLoader.observe(el);
});
```

### Optimal Image Size

```tsx
import { getOptimalImageSize } from "@/lib/performance";

const screenWidth = window.innerWidth;
const size = getOptimalImageSize(screenWidth);
// Returns: 320 | 640 | 1280 | 1920 | 2560 | 3840
```

---

## 🔧 Filters

### Complete Filter Hook

```tsx
import { usePropertyFilters } from "@/hooks/use-filters";

const filters = usePropertyFilters();

// Price filter
filters.priceFilter.minPrice              // Current value
filters.priceFilter.debouncedMinPrice     // Debounced value
filters.priceFilter.setMinPrice(value)    // Update

// Type filter  
filters.typeFilter.types                  // ['apartment', 'house']
filters.typeFilter.debouncedTypes         // Debounced
filters.typeFilter.toggleType('apartment') // Add/remove
filters.typeFilter.clearTypes()           // Reset

// Search filter
filters.searchFilter.searchTerm           // Current input
filters.searchFilter.debouncedSearchTerm  // Debounced (500ms)
filters.searchFilter.setSearchTerm(term)  // Update

// Location filter
filters.locationFilter.locations          // Selected locations
filters.locationFilter.toggleLocation()   // Add/remove

// Reset all
filters.resetAllFilters()
```

### Use Filters in Grid

```tsx
const filters = usePropertyFilters();

const filtered = useMemo(() => {
  return properties.filter(p => 
    p.price >= filters.priceFilter.debouncedMinPrice &&
    p.price <= filters.priceFilter.debouncedMaxPrice &&
    (filters.typeFilter.debouncedTypes.length === 0 ||
     filters.typeFilter.debouncedTypes.includes(p.type))
  );
}, [properties, filters.priceFilter.debouncedMinPrice, filters.priceFilter.debouncedMaxPrice, filters.typeFilter.debouncedTypes]);

<div className="grid">
  {filtered.map(p => <Card key={p.id} property={p} />)}
</div>
```

---

## 🎬 Animations

### Staggered Container

```tsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

<motion.div initial="hidden" animate="visible" variants={containerVariants}>
  {/* Children animate in sequence */}
</motion.div>
```

### Hover Lift Effect

```tsx
<motion.div
  whileHover={{ y: -8 }}
  transition={{ duration: 0.3 }}
>
  {/* Lifts 8px on hover */}
</motion.div>
```

### Viewport Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  {/* Animates when scrolled into view, only once */}
</motion.div>
```

### Scale on Tap

```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
>
  {/* Scales to 95% while clicked */}
</motion.button>
```

---

## 📱 Responsive Design

### 4K Breakpoints

```tsx
// Use these Tailwind breakpoints:
// 3xl: 1920px (FHD)
// 4xl: 2560px (4K laptop/monitor) 
// 5xl: 3840px (4K full)
// 6xl: 5120px (8K)

<div className="text-lg 3xl:text-xl 4xl:text-2xl">
  Responsive text size
</div>

<div className="grid grid-cols-2 lg:grid-cols-3 4xl:grid-cols-6">
  6 columns on 4K displays
</div>
```

### Container Max Width

```tsx
<div className="max-w-screen-4k mx-auto px-4 lg:px-8">
  {/* Content won't exceed 2560px width */}
  {/* Responsive padding: 16px → 32px */}
</div>
```

### Responsive Gap

```tsx
<div className="grid gap-4 md:gap-6 lg:gap-8">
  {/* 16px → 24px → 32px gap based on screen */}
</div>
```

---

## 🧪 Testing

### Test Dark Mode Toggle

```tsx
// In UserSettings
<button onClick={toggleDarkMode}>
  {isDarkMode ? "☀️ Light" : "🌙 Dark"}
</button>

// Verify localStorage.theme updates
// Verify all component colors adjust
```

### Test Filters

```tsx
// Price filter
// - Drag slider → should filter after 300ms
// - No immediate re-render ✓ (debounced)

// Type filter
// - Click checkboxes → update after 300ms
// - Multiple selections work ✓

// Search
// - Type in search → update after 500ms
// - Longer debounce for expensive search ✓
```

### Test 4K Layout

```
DevTools → Emulate device:
- Width: 3840px
- Height: 2160px
- DPR: 1

Expected:
- Grid shows 6 columns ✓
- Content stays centered ✓
- Spacing looks balanced ✓
- No horizontal scroll ✓
```

### Test Performance

```bash
DevTools → Performance tab
1. Click Recording
2. Scroll through property grid
3. Stop
4. Check:
   - FPS stays > 55
   - No long tasks (>50ms)
   - Memory stable
```

---

## 📚 Reference Files

| Feature | File | Lines |
|---------|------|-------|
| Buyer Dashboard | `client/pages/BuyerDashboard.tsx` | 591 |
| User Settings | `client/pages/UserSettings.tsx` | ~400 |
| Image Service | `client/lib/image-service.ts` | 150+ |
| Performance Utils | `client/lib/performance.ts` | 150+ |
| Filter Hooks | `client/hooks/use-filters.ts` | 130+ |
| Dark Mode Context | `client/lib/dark-mode-context.tsx` | ~60 |
| User Context | `client/lib/user-context.tsx` | ~120 |
| Global Styles| `client/global.css` | ~450 |
| Tailwind Config | `tailwind.config.ts` | ~130 |

---

## 🚀 Common Tasks

### Add a New Property

```tsx
const newProperty: Property = {
  id: "unique-id",
  name: "Property Name",
  price: 2500,
  location: "Los Angeles, CA",
  type: "apartment",
  bedrooms: 2,
  bathrooms: 2,
  size: 1200,
  image: getRandomPropertyImage(),
  isFavorite: false,
  isHot: false,
};

setProperties([...properties, newProperty]);
```

### Add a New Filter Type

```tsx
// In use-filters.ts
export function useBedroomFilter() {
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [debouncedBedrooms, setDebouncedBedrooms] = useState<number | null>(null);
  
  const debouncedUpdate = useCallback(
    debounce(() => setDebouncedBedrooms(bedrooms), 300),
    [bedrooms]
  );
  
  useEffect(() => debouncedUpdate(), [bedrooms, debouncedUpdate]);
  
  return { bedrooms, debouncedBedrooms, setBedrooms };
}
```

### Style a Dark Mode Component

```tsx
<div className={`
  p-4 rounded-lg transition-colors
  ${isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900'
  }
`}>
  Light/dark content
</div>
```

### Create a Debounced Input

```tsx
import { debounce } from "@/lib/performance";

const debouncedSearch = debounce((term: string) => {
  console.log("Searching for:", term);
}, 500);

<input 
  onChange={(e) => debouncedSearch(e.target.value)}
  placeholder="Search..."
/>
```

---

## ⚠️ Common Pitfalls

### ❌ Don't update filters immediately
```tsx
// Wrong - causes full re-render on each keystroke
const handleSearch = (term) => setSearchTerm(term);

// Correct - debounced
const handleSearch = debounce((term) => setSearchTerm(term), 500);
```

### ❌ Don't forget loading="lazy" on images
```tsx
// Wrong - loads all images immediately
<img src={url} alt="..." />

// Correct - lazy loads
<img src={url} alt="..." loading="lazy" />
```

### ❌ Don't use hardcoded breakpoints
```tsx
// Wrong
<div style={{ gridTemplateColumns: window.innerWidth > 1024 ? '3 1fr' : '1fr' }}>

// Correct - use Tailwind
<div className="grid grid-cols-1 lg:grid-cols-3">
```

### ❌ Don't render lists without memoization
```tsx
// Wrong - re-renders every item when parent updates
{properties.map(p => <Card property={p} />)}

// Correct - memoized
const Card = memo(({ property }) => (<div>...</div>));
{properties.map(p => <Card key={p.id} property={p} />)}
```

---

## 📖 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Query Docs](https://tanstack.com/query)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Dark Mode Tailwind](https://tailwindcss.com/docs/dark-mode)

---

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server on http://localhost:8080

# Building
pnpm build            # Build for production
pnpm start            # Run production server

# Quality
pnpm typecheck        # TypeScript validation
pnpm test            # Run Vitest tests
pnpm lint            # ESLint check

# Maintenance
pnpm install         # Install dependencies
pnpm update          # Update packages
```

---

**Happy coding! 🎉**

*For detailed feature information, see the comprehensive guides:*
- *4K_OPTIMIZATION_GUIDE.md*
- *IMAGE_LOADING_OPTIMIZATION_GUIDE.md*
- *IMPLEMENTATION_SUMMARY.md*
