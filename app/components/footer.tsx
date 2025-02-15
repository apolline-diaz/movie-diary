import Link from "next/link";

export default function Header() {
  return (
    <footer className="h-full footer  text-white p-10 b-0">
      <nav className="flex justify-between mb-2">
        <Link href="/" className="link link-hover">
          À propos
        </Link>
        <Link href="/" className="link link-hover">
          Contact
        </Link>
      </nav>
      <p className="font-light text-xs text-center">
        © 2024 Movie Diary. Tous droits réservés.
      </p>
    </footer>
  );
}
