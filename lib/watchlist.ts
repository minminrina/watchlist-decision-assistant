export type WatchStatus = "want" | "not_interested" | "dropped" | "watched";

export type WatchlistMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
  status?: WatchStatus;
  droppedAtMinute?: number;
  dropReason?: string;
};

const STORAGE_KEY = "watchlist-movies";

export function getWatchlist(): WatchlistMovie[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedMovies = localStorage.getItem(STORAGE_KEY);

  if (!savedMovies) {
    return [];
  }

  try {
    return JSON.parse(savedMovies);
  } catch {
    return [];
  }
}

export function saveWatchlist(movies: WatchlistMovie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export function addToWatchlist(
  movie: Omit<WatchlistMovie, "status">,
  initialStatus?: WatchStatus,
) {
  const currentWatchlist = getWatchlist();

  const alreadyExists = currentWatchlist.some(
    (savedMovie) => savedMovie.id === movie.id,
  );

  if (alreadyExists) {
    if (!initialStatus) {
      return currentWatchlist;
    }

    const updatedWatchlist = currentWatchlist.map((savedMovie) => {
      if (savedMovie.id !== movie.id) {
        return savedMovie;
      }

      return {
        ...savedMovie,
        status: initialStatus,
        droppedAtMinute: undefined,
        dropReason: undefined,
      };
    });

    saveWatchlist(updatedWatchlist);

    return updatedWatchlist;
  }

  const updatedWatchlist: WatchlistMovie[] = [
    {
      ...movie,
      status: initialStatus,
    },
    ...currentWatchlist,
  ];

  saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}

export function updateMovieStatus(
  movieId: number,
  updates: {
    status: WatchStatus;
    droppedAtMinute?: number;
    dropReason?: string;
  },
) {
  const updatedWatchlist = getWatchlist().map((movie) => {
    if (movie.id !== movieId) {
      return movie;
    }

    return {
      ...movie,
      status: updates.status,
      droppedAtMinute:
        updates.status === "dropped" ? updates.droppedAtMinute : undefined,
      dropReason: updates.status === "dropped" ? updates.dropReason : undefined,
    };
  });

  saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}

export function removeFromWatchlist(movieId: number) {
  const updatedWatchlist = getWatchlist().filter(
    (movie) => movie.id !== movieId,
  );

  saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}

export function isInWatchlist(movieId: number) {
  return getWatchlist().some((movie) => movie.id === movieId);
}