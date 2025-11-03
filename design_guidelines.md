# Design Guidelines: SaaS White Label Landing Page

## Design Approach
**Selected Approach**: Reference-Based (Stripe, Linear)
This landing page requires a modern, conversion-focused design with bold gradients and clear CTAs. Drawing inspiration from Stripe's clean layouts and Linear's contemporary aesthetic, while maintaining high conversion optimization.

## Core Design Elements

### Typography
- **Primary Font**: Inter or Poppins via Google Fonts
- **Headings**: 
  - H1 (Hero): text-5xl to text-6xl, font-bold
  - H2 (Section titles): text-4xl, font-bold
  - H3 (Cards/subsections): text-2xl, font-semibold
- **Body**: text-lg with text-gray-700 for readability
- **Emphasis**: Use font-semibold for key phrases, not italics

### Layout System
- **Container**: max-w-7xl for main sections, max-w-4xl for text-heavy content
- **Spacing Units**: Primarily use p-8, p-12, p-16, p-20 for sections (py-16 md:py-24 for major sections)
- **Grid Patterns**: 
  - Benefits cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Features list: grid-cols-1 md:grid-cols-2
  - Single column for FAQ and pricing

### Color Strategy
**Blue-Purple Gradient Theme** (to be defined later in color phase):
- Gradient backgrounds for hero and CTA sections
- White/light backgrounds for alternating sections
- Contrast sections with subtle background variations

### Component Library

**Hero Section**:
- Full-width gradient background section (min-h-screen not required)
- Centered content with max-w-4xl
- Large headline with emoji integration
- Subheadline and supporting text clearly separated
- Primary CTA button (prominent, rounded-full, large padding)
- Hero image: Mockup of the SaaS dashboard/interface on right side or below text on mobile

**Step-by-Step Section ("Como funciona")**:
- 6 numbered steps in grid or vertical flow
- Circle badges with numbers (bg-gradient with white text)
- Each step: number + bold title + description text
- Secondary CTA at bottom

**Inclusion List ("O que está incluso")**:
- Two-column checklist on desktop, single on mobile
- Checkmark icons (✓) before each item
- Group related items with subtle visual separation
- Clear, scannable list items

**Benefits Cards**:
- 6 cards in 3-column grid (responsive to 2 then 1)
- Each card: emoji/icon + title + short description
- Subtle hover effect (lift + shadow)
- Rounded corners (rounded-xl)
- White cards with subtle shadow on gradient background

**Pricing Section**:
- Centered pricing card with emphasis
- Large price display with /mês notation
- 4 bullet points below (Sem taxa, Sem limite, etc.)
- Prominent CTA button
- "No contracts" messaging clearly visible

**FAQ Section**:
- Accordion-style expandable questions
- 7 questions as specified
- Chevron icons to indicate expand/collapse
- Clear visual separation between items
- Generous padding for readability

**Footer**:
- Simple, minimal footer
- Contact information (WhatsApp reference)
- Support hours clearly stated
- Trust indicators if applicable

### Buttons & CTAs
- **Primary CTA**: Rounded-full, large padding (px-8 py-4), gradient background, white text, emoji prefix
- **Secondary CTA**: Similar style but outline or softer treatment
- Multiple CTAs throughout page (hero, mid-section, pricing, end)
- Consistent "Quero meu SaaS agora" or "Quero começar agora" messaging

### Icons
- Use Heroicons via CDN for UI elements (chevrons, checks, etc.)
- Emoji integration for personality (🚀, 💼, 💰, ⚙️, 📈, etc.) as specified in content
- Minimalist, vector-style icons for features

### Images
**Hero Image**: 
- Dashboard/SaaS interface mockup showing customization capabilities
- Placement: Right side on desktop, below text on mobile
- Style: Modern, clean screenshot or designed mockup with subtle shadow/perspective

**Additional Images**:
- Optional: Screenshots in "Como funciona" section showing admin panel
- Keep imagery minimal and purposeful - focus on conversion copy

### Animations
- **Scroll animations**: Subtle fade-up on section entry (intersection observer)
- **Button hovers**: Slight scale/shadow increase
- **Card hovers**: Gentle lift with shadow
- Keep animations minimal and professional - avoid distraction

### Accessibility
- Sufficient color contrast on gradient backgrounds
- Clear focus states on interactive elements
- Semantic HTML structure with proper heading hierarchy
- Accordion controls with proper ARIA labels

### Layout Flow
1. Hero (full-width gradient)
2. Como Funciona (white background, centered)
3. O Que Está Incluso (light gradient background)
4. Benefícios cards (white background)
5. Pricing (gradient background, emphasis)
6. FAQ (white background)
7. Final CTA (gradient background)
8. Footer (minimal, neutral)

Alternating backgrounds create visual rhythm and clear section separation. Each section should feel complete and purposeful with generous vertical padding.