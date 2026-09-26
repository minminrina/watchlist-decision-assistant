const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
};

type DiscoverMoviesResponse = {
  results: TmdbMovie[];
};

export async function discoverMovies(params: {
  genres?: number[];
  maxRuntime?: number;
}) {
  const searchParams = new URLSearchParams({
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: "1",
    sort_by: "popularity.desc",
    "vote_count.gte": "100",
  });

  if (params.genres && params.genres.length > 0) {
    searchParams.set("with_genres", params.genres.join("|"));
  }

  if (params.maxRuntime) {
    searchParams.set("with_runtime.lte", String(params.maxRuntime));
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load movies from TMDB.");
  }

  const data: DiscoverMoviesResponse = await response.json();

  return data.results;
}