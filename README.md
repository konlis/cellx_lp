# PV Magazyn — Landing Page

Landing page for **Home Fit+** by PV Magazyn — magazyn energii dla właścicieli paneli fotowoltaicznych. Dodaj baterię do istniejącej instalacji PV bez wymiany falownika, 5 200 zł taniej niż hybryda. Obsługujemy całe Podkarpacie.

## Tech Stack

- **Plain HTML/CSS/JS** — no framework, no build step
- **Vercel** — static hosting + serverless function for contact form
- **Resend** — transactional email API for form submissions

## Project Structure

```
pv-magazyn/
  index.html              # Single-page landing (all sections inline)
  css/styles.css           # Design system, layout, animations, responsive
  js/main.js               # Scroll observers, nav, counters, FAQ accordion, form
  js/lightning.js           # Canvas hero animation (energy lightning bolts)
  api/send.js              # Vercel serverless function — Resend email
  assets/images/           # Product photos, app screenshot
  robots.txt
  sitemap.xml
  vercel.json              # Security headers + cache config
```

## Local Development

No build required. Open `index.html` directly in a browser:

```bash
# Or use any local server:
npx serve .
# → http://localhost:3000
```

The contact form requires the Vercel serverless function to send emails (won't work locally without a proxy).

## Deployment (Vercel)

1. Push to a Git repository (GitHub/GitLab/Bitbucket)
2. Import the repository in [Vercel](https://vercel.com)
3. No build settings needed — Vercel serves static files automatically and detects `api/send.js` as a serverless function
4. Add environment variables in Vercel dashboard → Settings → Environment Variables:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key ([resend.com](https://resend.com)) |
| `RECIPIENT_EMAIL` | Email address to receive form submissions |

5. Deploy

## Contact Form Setup

The form POSTs to `/api/send`, which is a Vercel serverless function that forwards submissions via the Resend API.

**Form fields:** Imię, Nazwisko, Email, Miasto, Wiadomość

**To set up Resend:**
1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g., `pv-magazyn.pl`)
3. Generate an API key
4. Add `RESEND_API_KEY` and `RECIPIENT_EMAIL` as Vercel environment variables

## Page Sections

1. Sticky navigation with mobile hamburger
2. Hero with canvas lightning animation + product image
3. Trust strip (stats: savings, install time, standby power, efficiency)
4. Context intro (why battery storage — consumer pain points)
5. Core benefits (7 cards — compatibility, savings, fast install, low standby, voltage fix, subsidy protection, EMS grant)
6. CTA with product image and savings highlight (5 200 zł)
7. How it works (3 steps)
8. Mobile app preview
9. Service area (SVG map of województwo podkarpackie)
10. FAQ accordion (11 questions)
11. Contact form with validation
12. Footer with two contacts

## Service Area

Województwo podkarpackie: Rzeszów (siedziba), Przemyśl, Stalowa Wola, Mielec, Krosno, Jasło.

## SEO

- `<html lang="pl">`, semantic HTML5, single H1
- JSON-LD structured data: Product, FAQPage, LocalBusiness (6 cities), BreadcrumbList
- Open Graph meta tags
- Polish alt texts on all images
- `robots.txt` + `sitemap.xml`

## Design

- **Theme:** Dark tech-premium ("energy noir")
- **Colors:** Black (#1d1d1f), green accent (#7ed957), blue highlight (#005cbb)
- **Font:** Montserrat (400/600/800)
- **Animations:** Canvas lightning bolts, scroll reveals, animated counters, floating product image
- **Responsive:** Mobile (375px), tablet (768px), desktop (1440px)

## Contact

- **Łukasz Adamski** — l.adamski@pv-magazyn.pl | +48 720 284 284
- **Mateusz Matula** — m.matula@pv-magazyn.pl | +48 794 206 781
