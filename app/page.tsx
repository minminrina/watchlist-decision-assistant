"use client";

import Link from "next/link";
import { useState } from "react";
import { addToWatchlist, type WatchStatus } from "@/lib/watchlist";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity?: number;
};

const moods = [
  { label: "Feel-good", emoji: "☀️" },
  { label: "Funny", emoji: "😂" },
  { label: "Romantic", emoji: "💗" },
  { label: "Thrilling", emoji: "🔥" },
  { label: "Emotional", emoji: "🥹" },
  { label: "Mind-blowing", emoji: "🧠" },
];

const durations = ["Under 90 min", "90–120 min", "Over 2 hours"];

const genres = [
  "Comedy",
  "Drama",
  "Romance",
  "Thriller",
  "Horror",
  "Animation",
  "Sci-Fi",
  "Fantasy",
];

const genreIdMap: Record<string, number> = {
  Comedy: 35,
  Drama: 18,
  Romance: 10749,
  Thriller: 53,
  Horror: 27,
  Animation: 16,
  "Sci-Fi": 878,
  Fantasy: 14,
};

const moodGenreMap: Record<string, number[]> = {
  "Feel-good": [35, 10751, 16],
  Funny: [35],
  Romantic: [10749, 18],
  Thrilling: [53, 28, 80],
  Emotional: [18, 10749],
  "Mind-blowing": [878, 9648, 12],
};

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessages, setActionMessages] = useState<Record<number, string>>(
    {},
  );

  function toggleGenre(genre: string) {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    );
  }

  function getMatchInfo(movie: Movie) {
  let score = 48;
  const reasons: string[] = [];

  const selectedGenreIds = selectedGenres
    .map((genre) => genreIdMap[genre])
    .filter(Boolean);

  const moodGenreIds = selectedMood ? moodGenreMap[selectedMood] ?? [] : [];

  const matchedSelectedGenres = selectedGenreIds.filter((genreId) =>
    movie.genre_ids.includes(genreId),
  );

  const matchedMoodGenres = moodGenreIds.filter((genreId) =>
    movie.genre_ids.includes(genreId),
  );

  if (matchedSelectedGenres.length > 0) {
    const genreScore = Math.min(matchedSelectedGenres.length * 9, 22);
    score += genreScore;

    const shownGenres =
      selectedGenres.length > 2
        ? `${selectedGenres.slice(0, 2).join(", ")} + more`
        : selectedGenres.join(", ");

    reasons.push(`${shownGenres} preference`);
  }

  if (matchedMoodGenres.length > 0) {
    score += matchedMoodGenres.length > 1 ? 15 : 11;
    reasons.push(`${selectedMood} mood`);
  }

  if (selectedDuration) {
    score += 3;
    reasons.push("your time window");
  }

  const ratingScore = Math.round((movie.vote_average - 5) * 4.2);
  score += ratingScore;

  if (movie.vote_average >= 8) {
    reasons.push("excellent rating");
  } else if (movie.vote_average >= 7) {
    reasons.push("strong rating");
  } else if (movie.vote_average >= 6) {
    reasons.push("decent rating");
  } else {
    reasons.push("mixed rating");
  }

  const releaseYear = Number(movie.release_date?.slice(0, 4));
  const currentYear = new Date().getFullYear();

  if (releaseYear >= currentYear - 3) {
    score += 4;
    reasons.push("recent release");
  } else if (releaseYear < 2005 && movie.vote_average >= 7.5) {
    score += 3;
    reasons.push("trusted classic");
  }

  if (typeof movie.popularity === "number") {
    if (movie.popularity >= 200) {
      score += 5;
    } else if (movie.popularity >= 100) {
      score += 3;
    } else if (movie.popularity >= 50) {
      score += 1;
    }
  }

  const finalScore = Math.max(52, Math.min(score, 96));

  return {
    score: finalScore,
    reason:
      reasons.length > 0
        ? `Good fit for ${reasons.slice(0, 3).join(", ")}`
        : "Picked as a flexible option for tonight",
  };
}

  function getMatchBadge(score: number) {
    if (score >= 88) {
      return "Top match";
    }

    if (score >= 75) {
      return "Good fit";
    }

    return "Worth trying";
  }

  function handleQuickAction(movie: Movie, status?: WatchStatus) {
    addToWatchlist(
      {id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      },
      status,
    );

    const message =
    status === "not_interested"
      ? "Skipped and saved as Not interested"
      : status === "watched"
      ? "Marked as Watched"
      : "Saved to watchlist";

    setActionMessages((current) => ({
      ...current,
      [movie.id]: message,
    }));
  }

  async function handleFindMovies() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const params = new URLSearchParams();

      if (selectedGenres.length > 0) {
        params.set("genres", selectedGenres.join(","));
      }

      if (selectedDuration) {
        params.set("duration", selectedDuration);
      }

      if (selectedMood) {
        params.set("mood", selectedMood);
      }

      const response = await fetch(`/api/movies?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Could not load recommendations.");
      }

      const data = await response.json();

      setMovies(data.movies.slice(0, 8));
    } catch {
      setErrorMessage(
        "We could not load movie recommendations. Please check your TMDB access token.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0b18] px-5 py-8 text-white sm:px-10">
      <section className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-medium tracking-[0.22em] text-violet-300 uppercase">
          Watchlist Decision Assistant
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          What do you feel like watching tonight?
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          Tell us your mood, available time, and preferences. We will help you
          stop scrolling and find a movie that actually fits your evening.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Choose your mood</h2>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood.label;

                return (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setSelectedMood(mood.label)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-violet-300 bg-violet-500/30"
                        : "border-white/10 bg-white/5 hover:border-violet-300/70 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-2xl">{mood.emoji}</span>
                    <span className="mt-2 block font-medium">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9">
            <h2 className="text-xl font-semibold">
              How much time do you have?
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {durations.map((duration) => {
                const isSelected = selectedDuration === duration;

                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSelectedDuration(duration)}
                    className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
                      isSelected
                        ? "border-violet-300 bg-violet-500 text-white"
                        : "border-white/15 bg-white/5 text-zinc-200 hover:border-violet-300/70"
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9">
            <h2 className="text-xl font-semibold">Pick one or more genres</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);

                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isSelected
                        ? "border-pink-300 bg-pink-500/30 text-pink-100"
                        : "border-white/15 bg-white/5 text-zinc-200 hover:border-pink-300/70"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFindMovies}
            disabled={isLoading}
            className="mt-10 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 text-base font-bold shadow-lg transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? "Finding movies..." : "Find my movie →"}
          </button>
        </div>

        {errorMessage && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
            {errorMessage}
          </p>
        )}

        {movies.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-300">
                  Tonight&apos;s picks
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  Movies picked for you
                </h2>
              </div>

              {selectedMood && (
                <p className="hidden text-sm text-zinc-400 sm:block">
                  Mood: {selectedMood}
                </p>
              )}
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movies.map((movie) => {
                const matchInfo = getMatchInfo(movie);

                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-violet-300/60"
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        className="h-72 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-white/5 text-center text-sm text-zinc-400">
                        No poster available
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="line-clamp-1 font-semibold">
                        {movie.title}
                      </h3>

                      <div className="mt-2 flex items-center justify-between text-sm text-zinc-400">
                        <span>{movie.release_date?.slice(0, 4) || "—"}</span>
                        <span>★ {movie.vote_average.toFixed(1)}</span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
                        {movie.overview || "No description available yet."}
                      </p>

                      <div className="mt-4 min-h-[104px] rounded-xl border border-violet-300/20 bg-violet-500/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-violet-100">
                            {matchInfo.score}% match
                          </p>

                          <span className="rounded-full bg-violet-400/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-100">
                            {getMatchBadge(matchInfo.score)}
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-violet-100/80">
                          {matchInfo.reason}.
                        </p>

                        <div className="mt-4 space-y-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleQuickAction(movie);
                            }}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-violet-300/70 hover:bg-violet-500/10"
                          >
                            Save to watchlist
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleQuickAction(movie, "not_interested");
                              }}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-pink-300/70 hover:bg-pink-500/10"
                            >
                              Skip
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleQuickAction(movie, "watched");
                              }}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-green-300/70 hover:bg-green-500/10"
                            >
                              Watched
                            </button>
                          </div>
                        </div>

                        {actionMessages[movie.id] && (
                          <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-violet-100">
                            {actionMessages[movie.id]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
