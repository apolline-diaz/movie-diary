import Link from "next/link";

export default function Header() {
  return (
    <footer className="h-full footer  text-white px-10 pb-2 pt-4 border-t border-rose-500 b-0">
      <nav className="flex justify-between mb-2">
        <Link
          href="/about"
          className="link link-hover hover:underline hover:underline-offset-8"
        >
          À propos
        </Link>
        <Link
          href="/contact"
          className="link link-hover hover:underline hover:underline-offset-8"
        >
          Contact
        </Link>
      </nav>
      <p className="font-light text-xs text-center">
        © 2024 Movie Diary. Tous droits réservés.
      </p>
    </footer>
  );
}
