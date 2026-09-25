# Tech Fiesta Esports 2026

A tournament platform for Tech Fiesta Esports, a five squad collegiate championship. Squads register a five player
roster, the schedule generator produces a mathematically complete round robin, results feed a live
league table, and the top four seed a single elimination bracket.

Built with React, Vite, TypeScript and Firebase Firestore, with WebGL effects on OGL.

## What it does

| Capability | Detail |
| --- | --- |
| Registration | Five squads of exactly five players. Squad names, callsigns and player handles are validated for uniqueness across the whole pool. |
| Schedule generation | Deterministic circle method round robin. Five squads produce `C(5,2) = 10` fixtures across five rounds, no byes and no repeat pairings. |
| Results | Scores are filed per fixture and validated against the match format, so a BO1 cannot finish 2:1 and no fixture can end level. |
| League table | Three points for a win. Ties break on map difference, then maps won, then head to head. |
| Playoff bracket | The final table seeds two semifinals and a grand final. The final resolves its slots automatically as semifinal winners are decided. |
| Persistence | Firestore with real time subscriptions. Falls back to a browser backed store when no Firebase credentials are present. |
| Control desk | Passcode gated officials view for generating the schedule, filing results, withdrawing squads and resetting the tournament. |

## Getting started

```bash
npm install
npm run dev
```

The app runs immediately without any configuration. With no Firebase credentials it uses a local
store, which is useful for development and demos. The control desk reports which backend is active.

## Connecting Firebase

1. Create a Firebase project and enable Cloud Firestore.
2. Copy `.env.example` to `.env` and fill in the web app config values.
3. Restart the dev server. The control desk badge switches to `Firestore connected`.

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender id |
| `VITE_FIREBASE_APP_ID` | App id |
| `VITE_CONTROL_PASSCODE` | Passcode for the control desk, defaults to `techfiesta` |

Deploy the security rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The supplied rules allow public reads and validated writes, which suits a live event where captains
register themselves. Tighten them with Firebase Auth before running a tournament that needs
attribution.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type check and produce a production build |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Type check without emitting |

## Project structure

```
src/
  app/            Router, tournament context and provider
  components/
    fx/           Champion artwork, ribbon trails, ember canvas, scroll progress, spotlight
    home/         Landing page sections
    layout/       Shell, header, footer, section headings
    tournament/   Squad cards, fixture rows, bracket, standings, result entry
    ui/           Form fields, notices, empty states, reveal wrapper
  config/         Event content and tournament rules
  data/           Repository interface, Firestore and local implementations
  domain/         Round robin, knockout, standings and validation logic
  hooks/          Tournament access, countdown, reveal, parallax, motion guards
  lib/            Firebase initialisation, reveal registry and formatting helpers
  pages/          Route level views
  styles/         Design tokens, effects and stylesheets
  types/          Shared domain types
```

The domain layer is pure and has no React or Firebase imports, so the scheduling and standings logic
can be tested or reused independently of the interface.

## Design and motion

The interface is a broadcast style dark theme: blaze orange on blue black, chamfered panels cut with
`clip-path`, condensed poster type for headlines and a monospace face for data and labels. All colour,
type and shape values live as custom properties in `src/styles/tokens.css`, so the whole look can be
retuned from one file.

Motion is built from scratch rather than pulled from an animation library:

| Effect | Where |
| --- | --- |
| Ember particle field on a canvas, paused when off screen | `components/fx/EmberField.tsx` |
| WebGL ribbon trails that follow the pointer and drift when idle | `components/fx/Ribbons.tsx` |
| Pointer spotlight, desktop only | `components/fx/Spotlight.tsx` |
| Scroll progress bar | `components/fx/ScrollProgress.tsx` |
| Scroll reveal with wipe, lift and scale variants | `lib/revealRegistry.ts` |
| Animated SVG champion, float, halo pulse, blade gleam | `components/fx/ChampionArt.tsx` |
| Hero backdrop parallax | `hooks/useParallax.ts` |
| Counting statistics | `hooks/useCountUp.ts` |
| Perspective floor grid, orbiting light beam, grain, scanlines | `styles/effects.css` |

The ribbon trails are lazy loaded, so OGL stays out of the main bundle and only downloads when the
closing section is reached.

Every effect is gated. `prefers-reduced-motion: reduce` disables animation throughout, the spotlight
and parallax are skipped on small screens, the ember count drops on phones, and the canvas stops
drawing when it scrolls out of view. The layout is fluid from 320px upward, with the navigation
collapsing into a full screen takeover and fixture rows restacking into a vertical scoreboard.

## Changing the event

Everything on the landing page comes from `src/config/site.ts`: name, dates, venue, prize pool,
disciplines, running order, eligibility rules, FAQ and partners. Competition parameters live in
`src/config/tournament.ts`.

Increasing `maxTeams` works without any other change. The generator handles odd pool sizes by
inserting a bye, and the fixture count follows `n(n-1)/2` automatically.

## Deployment

The build is a static bundle in `dist`. Firebase Hosting is preconfigured with a single page
rewrite:

```bash
npm run build
firebase deploy --only hosting

built by chinmay
```

Any static host works. If you deploy somewhere other than Firebase, make sure unknown paths rewrite
to `index.html` so client side routing resolves.
