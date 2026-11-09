# CINEVA — Design System Specification

> **Version:** 2.0  
> **Brand:** CINEVA  
> **Aesthetic:** Minimalist Cinematic Luxury • High-Technology Theatrical Infrastructure

---

## 1. Brand Identity & Principles

CINEVA is an enterprise-grade cinema management and premium ticketing platform. Its interface must project:
- **Precision:** Mathematical rigor, perfect alignment, optical centering.
- **Cinematic Subtlety:** Atmospheric dark canvases that let movie imagery and 3D geometry command attention.
- **Strategic Contrast:** Vibrant `#FF6500` reserved for essential actions, seat statuses, and focal points—never used as indiscriminate fill.
- **Tactile Depth:** Subtle border definitions (`#222222`), muted surfaces (`#111111`), and elevated card tiers (`#181818`).

---

## 2. Color System

```
[ Canvas: #050505 ] ──> [ Secondary Canvas: #0B0B0B ] ──> [ Surface: #111111 ] ──> [ Elevated: #181818 ]
                                                                                   │
                                                      [ Primary Accent: #FF6500 ] ─┴─ [ Amber Hover: #B94700 ]
```

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `cineva.bg` | `#050505` | Main viewport canvas background. Deep obsidian black. |
| `cineva.bg-secondary`| `#0B0B0B` | Secondary page sections, header backing, input wells. |
| `cineva.surface` | `#111111` | Standard container cards, panels, dropdowns. |
| `cineva.elevated` | `#181818` | Floating modals, elevated tooltips, drawer panels, popovers. |
| `cineva.card` | `#141414` | Movie and cinema location cards with subtle hover shift. |
| `cineva.orange` | `#FF6500` | Primary action CTAs, selected seat indicators, active tabs. |
| `cineva.orange-hover`| `#FF7A1A` | Hover state for primary buttons and interactive links. |
| `cineva.amber` | `#B94700` | Secondary brand warm tone, VIP category accents, pressed states. |
| `cineva.text-primary`| `#FFFFFF` | Headings, selected labels, active button text, prices. |
| `cineva.text-secondary`| `#A0A0A0` | Body copy, secondary metadata, subtitles, descriptions. |
| `cineva.text-muted` | `#707070` | Timestamps, micro-labels, breadcrumbs, placeholder text. |
| `cineva.border` | `#222222` | Card borders, structural dividers, table row separations. |
| `cineva.border-subtle`| `rgba(255, 255, 255, 0.08)` | Semi-transparent borders for cards on complex backdrops. |

---

## 3. Typography (Inter)

CINEVA standardizes exclusively on **Inter** with clear optical weights and line heights.

| Role | Class | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `text-4xl md:text-5xl` | 36px–48px / 1.1 | Bold (700) | `-0.025em` | Hero titles, premiere marquee |
| **H1** | `text-3xl md:text-4xl` | 30px–36px / 1.2 | Bold (700) | `-0.02em` | Page main titles |
| **H2** | `text-2xl md:text-3xl` | 24px–30px / 1.25 | Semi-Bold (600) | `-0.015em` | Section headings, dialog titles |
| **H3** | `text-lg md:text-xl` | 18px–20px / 1.3 | Semi-Bold (600) | `-0.01em` | Card titles, drawer headers |
| **Body-LG** | `text-base` | 16px / 1.5 | Regular (400) | `normal` | Hero synopses, lead paragraphs |
| **Body** | `text-sm` | 14px / 1.45 | Regular (400) | `normal` | Standard descriptions, table values |
| **Caption** | `text-xs` | 12px / 1.4 | Medium (500) | `0.01em` | Badges, metadata, timestamps |
| **Micro** | `text-[11px]` | 11px / 1.3 | Semi-Bold (600) | `0.08em uppercase`| Overlines, category tags, specs |

---

## 4. Spacing Scale

Built on an 8px base grid:
- `4px` (`gap-1` / `p-1`) — Micro pill padding, icon spacing.
- `8px` (`gap-2` / `p-2`) — Compact button padding, tight lists.
- `12px` (`gap-3` / `p-3`) — Standard input inner padding, card gaps.
- `16px` (`gap-4` / `p-4`) — Card padding, component margins.
- `24px` (`gap-6` / `p-6`) — Container padding, section separators.
- `32px` (`gap-8` / `p-8`) — Major layout column gaps.
- `48px` (`py-12`) — Page section vertical spacing.
- `64px` (`py-16`) — Hero and major viewport spacing.

---

## 5. Component Primitives

### 5.1. Buttons (`Button.tsx`)
- **Primary:** `bg-[#FF6500] hover:bg-[#FF7A1A] text-white font-medium rounded-full px-5 py-2.5 transition-all shadow-glow-orange-sm active:scale-[0.98]`
- **Secondary:** `bg-[#181818] hover:bg-[#222222] text-white border border-[#222222] rounded-full px-5 py-2.5 transition-all`
- **Ghost:** `text-[#A0A0A0] hover:text-white hover:bg-white/[0.05] rounded-full px-4 py-2 transition-colors`
- **Outline:** `border border-[#222222] hover:border-[#FF6500] text-[#A0A0A0] hover:text-white rounded-full px-4 py-2`

### 5.2. Badges & Tags (`Badge.tsx`)
- **Format:** `bg-[#181818] text-[#FFFFFF] border border-[#222222] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md`
- **Brand / Accent:** `bg-[#FF6500]/15 text-[#FF6500] border border-[#FF6500]/30 text-[11px] font-bold uppercase px-2.5 py-1 rounded-md`
- **Status:** `Available` (`emerald`), `Selected` (`#FF6500`), `Occupied` (`#707070`), `Held` (`amber`).

### 5.3. Form Inputs (`Input.tsx`)
- Dark well: `bg-[#0B0B0B] border border-[#222222] rounded-xl text-white text-sm px-4 py-3 focus:border-[#FF6500] focus:ring-1 focus:ring-[#FF6500] transition-colors`

### 5.4. Cards & Panels
- Universal background: `bg-[#111111] border border-[#222222] rounded-2xl p-6 shadow-card-subtle`
- Hover state: `hover:border-white/20 hover:-translate-y-1 transition-all duration-300`

---

## 6. Interaction & Motion Rules

- **Transitions:** Standard duration `150ms–250ms` using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Haptic / Click Feedback:** `active:scale-[0.98]` on buttons and actionable cards.
- **Motion Reduction:** All animations obey `@media (prefers-reduced-motion: reduce)` without disabling functional visibility.
