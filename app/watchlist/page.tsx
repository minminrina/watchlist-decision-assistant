"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WatchStatusEditor from "@/components/WatchStatusEditor";
import {
  getWatchlist,
  removeFromWatchlist,
  type WatchlistMovie,
} from "@/lib/watchlist";

function getStatusLabel(status: WatchlistMovie["status"]) {
  if (!status) {
    return "No status yet";
  }

  if (status === "want") {
    return "Want to watch";
  }

  if (status === "not_interested") {
    return "Not interested";
  }

  if (status === "watched") {
    return "Watched";
  }

  return "Dropped";
}

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);

  function refreshWatchlist() {
    setMovies(getWatchlist());
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
    refreshWatchlist();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleRemove(movieId: number) {
    const updatedWatchlist = removeFromWatchlist(movieId);
    setMovies(updatedWatchlist);
  }

  return (
    <main className="min-h-screen bg-[#0d0b18] px-5 py-8 text-white sm:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">
              Your saved movies
            </p>

            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              Watch later
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-300 hover:text-white"
          >
            ← Find a movie
          </Link>
        </div>

        {movies.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-xl font-semibold">Your watchlist is empty.</p>

            <p className="mt-3 text-zinc-400">
              Save a movie from its details page and it will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-semibold"
            >
              Find something to watch →
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Link href={`/movie/${movie.id}`}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="h-80 w-full object-cover transition hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-white/5 text-sm text-zinc-400">
                      No poster available
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link href={`/movie/${movie.id}`}>
                    <h2 className="line-clamp-1 font-semibold hover:text-violet-200">
                      {movie.title}
                    </h2>
                  </Link>

                  <div className="mt-2 flex justify-between text-sm text-zinc-400">
                    <span>{movie.release_date?.slice(0, 4) || "—"}</span>
                    <span>★ {movie.vote_average.toFixed(1)}</span>
                  </div>

                  <p className="mt-3 rounded-full bg-violet-500/10 px-3 py-2 text-center text-xs font-medium text-violet-100">
                    {getStatusLabel(movie.status)}
                  </p>

                  {movie.status === "dropped" && (
                    <div className="mt-3 rounded-xl border border-pink-300/20 bg-pink-500/10 p-3 text-sm text-pink-100">
                      <p>
                        Dropped at:{" "}
                        {movie.droppedAtMinute
                          ? `${movie.droppedAtMinute} min`
                          : "not specified"}
                      </p>
                      <p className="mt-1">
                        Reason: {movie.dropReason || "not specified"}
                      </p>
                    </div>
                  )}

                  <WatchStatusEditor
                    movie={movie}
                    onUpdate={refreshWatchlist}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemove(movie.id)}
                    className="mt-4 w-full rounded-xl border border-pink-300/30 px-4 py-2 text-sm text-pink-200 transition hover:bg-pink-500/10"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}