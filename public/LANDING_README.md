# Cinematic Real Estate Landing Page

A stunning, full-featured HTML landing page for a real estate platform with cinematic animations and interactive 3D elements.

## 🎬 Features Implemented

### Hero Section
- ✅ Full-screen video background with cityscape at night
- ✅ Dark gradient overlay for text readability
- ✅ Large animated heading: "Own, Sell, and Manage Your Dream Properties"
- ✅ Animated subheading with platform description
- ✅ Two CTA buttons with hover effects
- ✅ Smooth fade-in animations with GSAP
- ✅ Scroll indicator with animation

### Features Section
- ✅ Four feature cards with icons:
  1. Buy & Sell Properties 🏠
  2. Manage Building Units 🏢
  3. Track Sold/Unsold Units 📊
  4. Analytics Dashboard 📈
- ✅ 3D tilt effect on hover (tracks mouse position)
- ✅ Smooth hover transitions with elevation
- ✅ Staggered entrance animations
- ✅ Gradient overlays on hover

### Interactive Building Visualization
- ✅ 3x3 grid of building units (A1-C3)
- ✅ Each unit shows sold/available status
- ✅ Different colors for sold (gold) vs available (neon blue)
- ✅ 3D transform on hover with perspective
- ✅ Animated unit entrance (scale + stagger)
- ✅ Real-time statistics with animated counters
  - Total Units: 67
  - Sold Units: 45
  - Available: 22

### Animations & Effects
- ✅ GSAP-powered scroll-triggered animations
- ✅ Parallax scrolling background circles
- ✅ Mouse-tracking parallax effect
- ✅ Smooth fade-ins and slide-ups
- ✅ 3D card tilt effects
- ✅ Animated number counters
- ✅ Loading screen with spinner
- ✅ Smooth scroll anchors

### Footer
- ✅ "Get Started" CTA button
- ✅ Animated social media icons (hover effects with rotation)
- ✅ Copyright information
- ✅ Fade-in animation on scroll

### Design System
- ✅ **Colors:**
  - Dark Blue (#0B1D51) - Background
  - Gold (#FFD700) - Primary accent
  - Neon Blue (#00FFFF) - Secondary accent
  - Light Gray (#E5E5E5) - Text
- ✅ **Typography:** Poppins (Google Fonts)
- ✅ **Animations:** GSAP 3.12.2 + ScrollTrigger
- ✅ Fully responsive design
- ✅ Mobile-optimized layout

## 🚀 How to Use

### Option 1: Direct Access
Open the file directly in your browser:
```
file:///C:/Users/home/Desktop/LosSantos(2.0)/public/landing.html
```

### Option 2: Serve with Development Server
If you have a local server running:
```
http://localhost:8080/landing.html
```

### Option 3: Integrate into React App
Replace the Welcome page route in App.tsx:
```tsx
<Route path="/landing" element={<iframe src="/landing.html" style={{width: '100%', height: '100vh', border: 'none'}} />} />
```

## 🎨 Customization

### Change Colors
Edit the CSS variables at the top of the `<style>` section:
```css
:root {
    --dark-blue: #0B1D51;
    --gold: #FFD700;
    --neon-blue: #00FFFF;
    --light-gray: #E5E5E5;
}
```

### Replace Video Background
Change the video source in the hero section:
```html
<video class="hero-video" autoplay muted loop playsinline>
    <source src="YOUR_VIDEO_URL.mp4" type="video/mp4">
</video>
```

### Update Building Units
Modify the building units in the HTML:
```html
<div class="building-unit sold">  <!-- or "available" -->
    <div class="unit-label">A1</div>
    <div class="unit-status">Sold</div>  <!-- or "Available" -->
</div>
```

### Adjust Statistics
Change the `data-target` attribute on stat numbers:
```html
<div class="stat-number" data-target="67">0</div>
```

## 🛠️ Technical Details

### Libraries Used
- **GSAP 3.12.2** - Advanced animation engine
- **ScrollTrigger** - Scroll-based animations
- **Google Fonts** - Poppins font family

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Video lazy-loading
- CSS transforms for animations (GPU-accelerated)
- Optimized GSAP animations
- Smooth 60fps performance

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** < 768px

### Mobile Optimizations
- Stacked layout for buttons
- 2-column building grid
- Reduced font sizes
- Touch-optimized hover states

## 🎯 Features Roadmap

### Implemented ✅
- Full-screen hero with video
- Animated headlines and CTAs
- 4 feature cards with 3D tilt
- Interactive building visualization
- Parallax effects
- Scroll animations
- Animated statistics
- Responsive design

### Future Enhancements (Optional)
- Add real property data API integration
- Light/dark mode toggle
- Multi-language support
- More building layouts
- Virtual tour integration
- Live chat widget

## 🔗 Navigation Links

The page includes links to your React application:
- **Explore Properties** → `/user-login`
- **Manage My Units** → `/seller-login`
- **Sign Up Now** → `/user-login`

## 📄 File Structure

```
public/
└── landing.html          # Complete standalone page (HTML + CSS + JS)
```

## 🎬 Animation Timeline

1. **0-1s:** Loading screen
2. **1-2s:** Hero badge fades in
3. **1.4-2.6s:** Main heading appears
4. **1.8-2.8s:** Subheading appears
5. **2.2-3.2s:** CTA buttons appear
6. **On Scroll:**
   - Features section animates in
   - Building units pop in with stagger
   - Statistics count up
   - Footer fades in

## 💡 Tips

1. **Video Performance:** Use compressed MP4 files for best performance
2. **Animations:** Reduce animation intensity on mobile if needed
3. **Accessibility:** Add `aria-labels` for screen readers
4. **SEO:** Add meta tags for social sharing

## 📞 Support

For customization help or questions, refer to:
- GSAP Docs: https://greensock.com/docs/
- ScrollTrigger: https://greensock.com/scrolltrigger/

---

**Created for:** Aurum Estates Real Estate Platform  
**Version:** 1.0.0  
**Last Updated:** March 1, 2026
