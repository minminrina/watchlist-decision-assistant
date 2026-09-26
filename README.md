# Watchlist Decision Assistant

A movie decision assistant that helps users choose what to watch based on mood, available time, genres, and viewing behavior.

This project is not just a basic movie search app. It focuses on reducing decision fatigue by helping users quickly decide whether to save, skip, watch, or drop a movie.

## Features

### Personalized movie discovery

Users can choose:

- mood
- available watching time
- preferred genres

The app then recommends movies using the TMDB API.

### Match score

Each recommended movie includes a match percentage and a short explanation based on:

- selected mood
- selected genres
- available time
- movie rating
- release year
- popularity

### Quick decision actions

Users can quickly mark a movie as:

- Save to watchlist
- Skip
- Watched

### Movie details page

Each movie has a detail page with:

- poster
- background image
- title
- release year
- runtime
- rating
- genres
- overview
- spoiler-free note area
- add to watchlist button

### Watchlist

Saved movies are stored locally and can be managed by status:

- No status yet
- Want to watch
- Not interested
- Watched
- Dropped

For dropped movies, users can also record:

- dropped minute
- drop reason

### Statistics dashboard

The stats page shows:

- total saved movies
- movies the user wants to watch
- watched movies
- skipped movies
- dropped movies
- average drop minute
- most common drop reason
- full movie status overview

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- TMDB API
- React state management
- localStorage

## Project Structure

```text
app/
  api/movies/
  movie/[id]/
  watchlist/
  stats/
  discover/

components/
  Header.tsx
  WatchlistButton.tsx
  WatchStatusEditor.tsx

lib/
  tmdb.ts
  watchlist.ts

types/
  movie.ts
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/minminrina/watchlist-decision-assistant.git
cd watchlist-decision-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the project root:

```env
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build Check

The project was checked with:

```bash
npm run lint
npm run build
```

Current build status:

```text
Build successful
TypeScript check passed
```

There are only image optimization warnings from Next.js because the project currently uses standard `<img>` tags instead of `next/image`.

## Future Improvements

Possible next steps:

- user authentication
- Supabase database integration
- group voting room
- realtime collaborative movie picking
- spoiler-free user reviews
- better recommendation algorithm
- deployment on Vercel

## Purpose

This project was built as a frontend portfolio project to demonstrate:

- Next.js App Router
- TypeScript
- API integration
- UI state management
- product thinking
- user-focused feature design
- dashboard and statistics UI
EOF