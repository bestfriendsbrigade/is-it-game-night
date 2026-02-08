# Is It Game Night? 🎮

A simple voting app for friends to confirm if tonight is game night. Built with TanStack Start, React, and Upstash Redis.

## Features

- **Three-user voting system** (reco, beco, peco)
- **Real-time vote updates** - see when your friends vote (polls every 2 seconds)
- **Daily vote reset** - votes are scoped to the current day in East Coast timezone
- **Simple authentication** - pick your identity and verify with a codename
- **Display logic**:
  - Any "no" vote → Shows "NO" ❌
  - All three "yes" votes → Shows "YES" ✅
  - Otherwise → Shows "MAYBE!?" ❓

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Upstash Redis

1. Create a free account at [upstash.com](https://upstash.com)
2. Create a new Redis database (Global or Regional)
3. Copy your connection details

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   # Upstash Redis
   KV_REST_API_URL=your_upstash_redis_url_here
   KV_REST_API_TOKEN=your_upstash_redis_token_here

   # Authorization Codenames (keep these secret!)
   CODENAME_PECO=your_secret_codename_for_peco
   CODENAME_BECO=your_secret_codename_for_beco
   CODENAME_RECO=your_secret_codename_for_reco
   ```

   **Important**: The codenames are used for user verification. Keep them private!

### 4. Add Avatar Images

Place square avatar images in `public/avatars/`:
- `reco.png` - Avatar for Reco
- `beco.png` - Avatar for Beco
- `peco.png` - Avatar for Peco

Images should be square (e.g., 512x512px) and in PNG format.

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## User Flow

1. **Select Identity** → Pick who you are (reco, beco, or peco)
2. **Verify Codename** → Enter your secret codename (configured in environment variables)
3. **Vote** → Click YES or NO to cast your vote
4. **Watch Result Update** → The display updates automatically when others vote

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with React 19
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Real-time Updates**: [TanStack Query](https://tanstack.com/query) (polling)
- **Database**: [Upstash Redis](https://upstash.com)
- **Validation**: [Zod](https://zod.dev)
- **Date Handling**: [date-fns](https://date-fns.org/) with timezone support
- **Type Safety**: TypeScript (strict mode)

## Project Structure

```
src/
├── components/          # React components
│   ├── SelectIdentity.tsx       # "Who are you?" page
│   ├── VerifyCodename.tsx       # Codename verification
│   └── VoteInterface.tsx        # Main voting interface
├── lib/                 # Utilities
│   ├── constants.ts            # User data (codenames from env vars)
│   ├── redis.ts                # Upstash Redis client
│   └── session.ts              # Cookie utilities
├── routes/              # File-based routes
│   ├── __root.tsx              # Root layout
│   ├── index.tsx               # "/" - Identity selection
│   ├── verify.tsx              # "/verify" - Codename check
│   └── vote.tsx                # "/vote" - Voting page
├── schemas/             # Zod validation schemas
│   └── index.ts
└── server/              # Server functions
    ├── auth.ts                 # Authentication logic
    └── votes.ts                # Vote operations
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `KV_REST_API_URL` - Your Upstash Redis URL
   - `KV_REST_API_TOKEN` - Your Upstash Redis token
   - `CODENAME_PECO` - Secret codename for peco
   - `CODENAME_BECO` - Secret codename for beco
   - `CODENAME_RECO` - Secret codename for reco
4. Deploy!

The app will work on Vercel's free tier.

**Security Note**: Never commit your actual `.env.local` file. Use Vercel's environment variables or GitHub Secrets for production deployments.

## How It Works

### Vote Storage
- Votes are stored in Redis with keys like `votes:2026-02-02:reco`
- Keys automatically expire at midnight ET the next day
- Each user can only cast one vote per day

### Authentication
- Session stored in HTTP-only cookies
- Two-step verification: identity selection → codename check
- Server-side validation (case-insensitive)

### Real-Time Updates
- TanStack Query polls the `/server/votes.getVotes` endpoint every 2 seconds
- When any user votes, all connected clients see the update within 2 seconds
- No WebSockets needed - simple polling is sufficient for 3 users

## Cost

- **Hosting**: Free (Vercel free tier)
- **Database**: Free (Upstash free tier: 10,000 commands/day)
- **Expected usage**: ~10-20 Redis operations per day
- **Total**: $0/month 🎉

## Development Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Lint code with Biome
pnpm format     # Format code with Biome
pnpm check      # Run Biome checks
```

## License

MIT
