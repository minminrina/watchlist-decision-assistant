import Link from "next/link";
import { notFound } from "next/navigation";

import WatchlistButton from "@/components/WatchlistButton";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  tagline: string;
  original_language: string;
};

async function getMovie(id: string): Promise<MovieDetails | null> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  return (
    <main className="min-h-screen bg-[#0d0b18] px-5 py-8 text-white sm:px-10">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-300 hover:text-white"
        >
          ← Back to recommendations
        </Link>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          )}

          <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[280px_1fr]">
            <div>
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-white/10 text-sm text-zinc-400">
                  No poster available
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">
                Movie details
              </p>

              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-4 text-lg italic text-violet-200">
                  “{movie.tagline}”
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
                <span>
                  {movie.release_date?.slice(0, 4) || "Unknown year"}
                </span>
                <span>•</span>
                <span>{movie.runtime ? `${movie.runtime} min` : "Runtime unknown"}</span>
                <span>•</span>
                <span>★ {movie.vote_average.toFixed(1)}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-100"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-3xl text-base leading-7 text-zinc-200">
                {movie.overview || "No description is available yet."}
              </p>

              <div className="mt-8 rounded-2xl border border-pink-300/20 bg-pink-500/10 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-pink-200">
                  Spoiler-free note
                </p>
                <p className="mt-2 leading-7 text-zinc-200">
                  Add your own spoiler-free review later: explain the mood,
                  pacing, and who may enjoy this movie without revealing key plot points.
                </p>
              </div>

              <WatchlistButton
                movie={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                  addedAt: new Date().toISOString(),
                }}
            />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}