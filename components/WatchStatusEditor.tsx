"use client";

import { useState } from "react";
import {
  updateMovieStatus,
  type WatchStatus,
  type WatchlistMovie,
} from "@/lib/watchlist";

type WatchStatusEditorProps = {
  movie: WatchlistMovie;
  onUpdate: () => void;
};

const statusOptions: { value: WatchStatus; label: string }[] = [
  { value: "want", label: "Want to watch" },
  { value: "not_interested", label: "Not interested" },
  { value: "watched", label: "Watched" },
  { value: "dropped", label: "Dropped" },
];

const dropReasons = [
  "Too boring",
  "Too heavy",
  "Bad pacing",
  "Not my mood",
  "Too predictable",
  "Other",
];

export default function WatchStatusEditor({
  movie,
  onUpdate,
}: WatchStatusEditorProps) {
  const [status, setStatus] = useState<WatchStatus | "">(movie.status ?? "");
  const [droppedAtMinute, setDroppedAtMinute] = useState(
    movie.droppedAtMinute?.toString() ?? "",
  );
  const [dropReason, setDropReason] = useState(movie.dropReason ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  function handleStatusChange(newStatus: WatchStatus) {
    setStatus(newStatus);
    setErrorMessage("");

    if (newStatus !== "dropped") {
      setDroppedAtMinute("");
      setDropReason("");
    }
  }

  function handleSave() {
    setErrorMessage("");

    if (!status) {
      setErrorMessage("Please select a viewing status.");
      return;
    }

    if (status === "dropped") {
      const minute = Number(droppedAtMinute);

      if (!droppedAtMinute || Number.isNaN(minute) || minute <= 0) {
        setErrorMessage("Please enter the minute where you dropped the movie.");
        return;
      }

      if (!dropReason) {
        setErrorMessage("Please select a reason for dropping the movie.");
        return;
      }
    }

    updateMovieStatus(movie.id, {
      status,
      droppedAtMinute:
        status === "dropped" ? Number(droppedAtMinute) : undefined,
      dropReason: status === "dropped" ? dropReason : undefined,
    });

    onUpdate();
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-zinc-200">Viewing status</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const isSelected = status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStatusChange(option.value)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? "border-violet-300 bg-violet-500/30 text-violet-100"
                  : "border-white/15 text-zinc-400 hover:border-violet-300/70 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {status === "dropped" && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-zinc-400">
              Dropped at minute
            </label>

            <input
              type="number"
              min="1"
              value={droppedAtMinute}
              onChange={(event) => {
                setDroppedAtMinute(event.target.value);
                setErrorMessage("");
              }}
              placeholder="e.g. 23"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400">Reason</label>

            <select
              value={dropReason}
              onChange={(event) => {
                setDropReason(event.target.value);
                setErrorMessage("");
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#181321] px-3 py-2 text-sm text-white outline-none focus:border-violet-300"
            >
              <option value="">Select a reason</option>
              {dropReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        Save status
      </button>
    </div>
  );
}