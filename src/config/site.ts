export const site = {
  name: 'Tech Fiesta Esports',
  shortName: 'Tech Fiesta',
  edition: 'Esports 2026',
  code: 'TFE-26',
  tagline: 'Five squads enter the group stage. One leaves with the title.',
  summary:
    'Tech Fiesta Esports is a closed invitational for collegiate esports programmes. Every registered squad plays every rival once in a mathematically complete round robin, the table decides the playoff seeding, and the bracket decides the champion.',
  startsAt: '2026-10-17T11:00:00+05:30',
  endsAt: '2026-10-18T21:00:00+05:30',
  dateLabel: '17 to 18 October 2026',
  venue: 'Hall 4, Innovation Campus',
  city: 'Mumbai, India',
  prizePool: '250,000',
  currency: 'INR',
  broadcast: 'twitch.tv/techfiesta',
  contactEmail: 'operations@techfiesta.gg',
  contactPhone: '+91 22 4000 1100',
} as const

export const navigation = [
  { label: 'Overview', to: '/' },
  { label: 'Squads', to: '/squads' },
  { label: 'Fixtures', to: '/fixtures' },
  { label: 'Standings', to: '/standings' },
  { label: 'Register', to: '/register' },
] as const

export const disciplines = [
  {
    title: 'Tactical Shooter',
    mode: '5v5 Search and Destroy',
    detail: 'Best of one through the group stage, best of three from the semifinals, best of five in the grand final.',
    stage: 'Main title',
  },
  {
    title: 'Squad Survival',
    mode: '5v5 Battle Royale',
    detail: 'Placement plus elimination scoring across three drops. Run as the secondary bracket on day one.',
    stage: 'Secondary',
  },
  {
    title: 'Arena Football',
    mode: '2v2 Showcase',
    detail: 'Exhibition ladder played between main stage fixtures. Open to all registered players.',
    stage: 'Showcase',
  },
  {
    title: 'Block Warfare',
    mode: '5v5 Bed Defence',
    detail: 'Resource control format with a hard twenty minute clock. Scheduled after the group stage closes.',
    stage: 'Showcase',
  },
] as const

export const schedule = [
  { time: '09:30', day: 'Day 1', label: 'Check in and device audit', note: 'Peripherals sealed, rosters verified against submitted handles.' },
  { time: '11:00', day: 'Day 1', label: 'Group stage rounds one to three', note: 'Six fixtures on the main stage, best of one.' },
  { time: '15:30', day: 'Day 1', label: 'Secondary bracket', note: 'Squad Survival drops one through three run on the side stage.' },
  { time: '18:00', day: 'Day 1', label: 'Group stage rounds four and five', note: 'Remaining four fixtures. Table locks at the final whistle.' },
  { time: '10:00', day: 'Day 2', label: 'Seeding announcement', note: 'Top four qualify. Seed one faces seed four, seed two faces seed three.' },
  { time: '12:00', day: 'Day 2', label: 'Semifinals', note: 'Best of three, played back to back on the main stage.' },
  { time: '17:00', day: 'Day 2', label: 'Grand final', note: 'Best of five with a full broadcast desk and live crowd.' },
  { time: '20:30', day: 'Day 2', label: 'Presentation', note: 'Trophy, prize distribution and closing remarks.' },
] as const

export const prizes = [
  { tier: 1, place: 'Champion', note: 'Plus trophy and season slot', amount: '125,000' },
  { tier: 2, place: 'Runner up', note: 'Plus medals', amount: '70,000' },
  { tier: 3, place: 'Third place', note: 'Losing semifinalist with the better table finish', amount: '35,000' },
  { tier: 4, place: 'Fourth place', note: 'Remaining semifinalist', amount: '20,000' },
] as const

export const eligibility = [
  'Every player must hold a valid enrolment record at an accredited institution for the 2026 academic year.',
  'A squad is exactly five players. Substitutes are not carried in this edition.',
  'A player may appear on one roster only. Duplicate handles across squads void both entries.',
  'Handles submitted at registration are the handles used on stage. Changes close seventy two hours before day one.',
  'Peripherals are inspected at check in. Anything not sealed by the officials cannot be used on the main stage.',
  'Match officials rule on all disputes on site. Decisions are recorded and final.',
] as const

export const faqs = [
  {
    q: 'How many squads are accepted',
    a: 'The pool is capped at five squads. Registration closes the moment the fifth roster is verified, and the fixture generator unlocks at that point.',
  },
  {
    q: 'Why a round robin instead of a straight bracket',
    a: 'A five squad round robin produces ten fixtures and gives every squad the same schedule. No squad receives a bye, an easier half of the draw or a bracket bypass. The table is the honest input to the playoff seeding.',
  },
  {
    q: 'How is the playoff seeding decided',
    a: 'Points first, then map difference, then maps won, then head to head result. The top four carry into the semifinals as seed one through seed four.',
  },
  {
    q: 'Can we substitute a player after registration',
    a: 'No. This edition runs five player rosters with no substitutes. A squad that cannot field five players forfeits the fixture.',
  },
  {
    q: 'Is there an entry fee',
    a: 'There is no entry fee. Travel and accommodation are the responsibility of the squad, and the organisers arrange practice room access from the evening before day one.',
  },
  {
    q: 'Where are the matches broadcast',
    a: 'Every main stage fixture is streamed with a full commentary desk. Side stage showcases are recorded and published after the event.',
  },
] as const

export const partners = [
  { name: 'Northbeam', tier: 'Title partner' },
  { name: 'Halcyon Labs', tier: 'Hardware' },
  { name: 'Ridgeline', tier: 'Broadcast' },
  { name: 'Meridian Sport', tier: 'Apparel' },
  { name: 'Astra Energy', tier: 'Refreshment' },
  { name: 'Pulse Network', tier: 'Connectivity' },
  { name: 'Forge Collective', tier: 'Production' },
  { name: 'Civic Union', tier: 'Venue' },
] as const
