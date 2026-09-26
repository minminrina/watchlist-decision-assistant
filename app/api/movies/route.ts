import { NextRequest, NextResponse } from "next/server";
import { discoverMovies } from "@/lib/tmdb";

const genreMap: Record<string, number> = {
  Comedy: 35,
  Drama: 18,
  Romance: 10749,
  Thriller: 53,
  Horror: 27,
  Animation: 16,
  "Sci-Fi": 878,
  Fantasy: 14,
};

const moodGenres: Record<string, number[]> = {
  "Feel-good": [35, 10751, 16],
  Funny: [35],
  Romantic: [10749, 18],
  Thrilling: [53, 28, 80],
  Emotional: [18, 10749],
  "Mind-blowing": [878, 9648, 12],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const selectedGenres = searchParams
      .get("genres")
      ?.split(",")
      .map((genre) => genreMap[genre])
      .filter(Boolean) as number[] | undefined;

    const mood = searchParams.get("mood");

    const moodBasedGenres = mood ? moodGenres[mood] : [];

    const combinedGenres = [
      ...(selectedGenres ?? []),
      ...(moodBasedGenres ?? []),
    ];

    const uniqueGenres = [...new Set(combinedGenres)];

    const duration = searchParams.get("duration");

    const maxRuntime =
      duration === "Under 90 min"
        ? 90
        : duration === "90–120 min"
          ? 120
          : undefined;

    const movies = await discoverMovies({
      genres: uniqueGenres.length > 0 ? uniqueGenres : undefined,
      maxRuntime,
    });

    const filteredMovies = movies.filter((movie) => {
      const releaseYear = Number(movie.release_date?.slice(0, 4));

      return (
        movie.poster_path &&
        movie.overview &&
        releaseYear >= 1990 &&
        releaseYear <= new Date().getFullYear()
      );
    });

    return NextResponse.json({ movies: filteredMovies });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Could not load movie recommendations." },
      { status: 500 },
    );
  }
}