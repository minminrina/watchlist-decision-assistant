"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Discover" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/stats", label: "Stats" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-[#0d0b18]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          Watchlist<span className="text-violet-300">.</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-500/20 text-violet-200"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}