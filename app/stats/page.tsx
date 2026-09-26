"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getWatchlist, type WatchlistMovie } from "@/lib/watchlist";

function getMostCommonDropReason(movies: WatchlistMovie[]) {
  const droppedMovies = movies.filter(
    (movie) => movie.status === "dropped" && movie.dropReason,
  );

  if (droppedMovies.length === 0) {
    return "No data yet";
  }

  const reasonCounts = droppedMovies.reduce<Record<string, number>>(
    (counts, movie) => {
      if (!movie.dropReason) {
        return counts;
      }

      counts[movie.dropReason] = (counts[movie.dropReason] || 0) + 1;

      return counts;
    },
    {},
  );

  const sortedReasons = Object.entries(reasonCounts).sort(
    (a, b) => b[1] - a[1],
  );

  return sortedReasons[0][0];
}

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

export default function StatsPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
    setMovies(getWatchlist());
  }, 0);

  return () => window.clearTimeout(timer);
}, []);

  const stats = useMemo(() => {
    const savedMovies = movies.length;

    const wantToWatch = movies.filter((movie) => movie.status === "want").length;

    const watched = movies.filter((movie) => movie.status === "watched").length;

    const notInterested = movies.filter(
      (movie) => movie.status === "not_interested",
    ).length;

    const droppedMovies = movies.filter(
      (movie) => movie.status === "dropped",
    );

    const droppedWithMinute = droppedMovies.filter(
      (movie) => typeof movie.droppedAtMinute === "number",
    );

    const averageDropMinute =
      droppedWithMinute.length > 0
        ? droppedWithMinute.reduce(
            (sum, movie) => sum + (movie.droppedAtMinute || 0),
            0,
          ) / droppedWithMinute.length
        : 0;

    const noStatus = movies.filter((movie) => !movie.status).length;

    return {
      savedMovies,
      wantToWatch,
      watched,
      notInterested,
      droppedMovies: droppedMovies.length,
      averageDropMinute,
      noStatus,
      mostCommonDropReason: getMostCommonDropReason(movies),
    };
  }, [movies]);

  return (
    <main className="min-h-screen bg-[#0d0b18] px-5 py-8 text-white sm:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">
              Your viewing profile
            </p>

            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              Watchlist stats
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Understand what you actually want to watch, what you avoid, and
              where movies usually lose your attention.
            </p>
          </div>

          <Link
            href="/watchlist"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-300 hover:text-white"
          >
            Edit watchlist →
          </Link>
        </div>

        {movies.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-xl font-semibold">No stats yet.</p>

            <p className="mt-3 text-zinc-400">
              Add movies to your watchlist and mark their status to build your
              viewing profile.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-semibold"
            >
              Find a movie →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Saved movies
                </p>
                <p className="mt-4 text-4xl font-bold">{stats.savedMovies}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Total movies in your watchlist.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Want to watch
                </p>
                <p className="mt-4 text-4xl font-bold">{stats.wantToWatch}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Movies you still feel interested in.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Watched movies
                </p>
                <p className="mt-4 text-4xl font-bold">{stats.watched}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Movies you already finished.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Not interested
                </p>
                <p className="mt-4 text-4xl font-bold">{stats.notInterested}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Movies you decided to skip.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Dropped movies
                </p>
                <p className="mt-4 text-4xl font-bold">{stats.droppedMovies}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Movies that did not keep your attention.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Average drop minute
                </p>
                <p className="mt-4 text-4xl font-bold">
                  {stats.averageDropMinute > 0
                    ? `${Math.round(stats.averageDropMinute)} min`
                    : "—"}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  When you usually stop watching.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-400">
                  Main drop reason
                </p>
                <p className="mt-4 line-clamp-1 text-3xl font-bold">
                  {stats.mostCommonDropReason}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  The most common reason you abandon a movie.
                </p>
              </article>
            </div>

            {stats.noStatus > 0 && (
              <div className="mt-8 rounded-3xl border border-yellow-300/20 bg-yellow-500/10 p-5 text-yellow-100">
                <p className="font-semibold">
                  {stats.noStatus} movie{stats.noStatus > 1 ? "s" : ""} still{" "}
                  {stats.noStatus > 1 ? "have" : "has"} no status.
                </p>

                <p className="mt-2 text-sm text-yellow-100/80">
                  Go to your watchlist and mark{" "}
                  {stats.noStatus > 1 ? "them" : "it"} as Want to watch, Not
                  interested, Watched, or Dropped to make your stats more
                  accurate.
                </p>
              </div>
            )}

            <section className="mt-12">
              <h2 className="text-2xl font-bold">Movie status overview</h2>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                {movies.map((movie, index) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 transition last:border-b-0 hover:bg-white/5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{movie.title}</p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {movie.release_date?.slice(0, 4) || "Unknown year"} ·{" "}
                          ★ {movie.vote_average.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-100">
                        {getStatusLabel(movie.status)}
                      </p>

                      {movie.status === "dropped" && (
                        <p className="mt-2 text-xs text-pink-200">
                          {movie.droppedAtMinute
                            ? `${movie.droppedAtMinute} min`
                            : "No minute"}{" "}
                          · {movie.dropReason || "No reason"}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}