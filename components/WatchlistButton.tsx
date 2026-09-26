"use client";

import { useEffect, useState } from "react";
import {
  addToWatchlist,
  isInWatchlist,
  type WatchlistMovie,
} from "@/lib/watchlist";

type WatchlistButtonProps = {
  movie: Omit<WatchlistMovie, "status">;
};

export default function WatchlistButton({ movie }: WatchlistButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSaved(isInWatchlist(movie.id));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [movie.id]);

  function handleAddToWatchlist() {
    addToWatchlist(movie);
    setSaved(true);
  }

  return (
    <button
      type="button"
      onClick={handleAddToWatchlist}
      disabled={saved}
      className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 font-bold transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-default disabled:opacity-60 sm:w-fit"
    >
      {saved ? "✓ Added to watchlist" : "+ Add to watchlist"}
    </button>
  );
}