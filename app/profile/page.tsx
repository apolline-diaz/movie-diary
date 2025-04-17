import { ListCard } from "@/app/components/list-card";
import Link from "next/link";
import { getLists } from "../server-actions/lists/get-lists";
import { isAdmin } from "@/utils/is-user-admin";

export const revalidate = 0;

export default async function ProfilePage() {
  const lists = await getLists();

  return (
    <div className="flex flex-col gap-5 px-10 py-20">
      {/* Users lists */}
      <section className="">
        <h1 className="text-2xl text-rose-500 mb-5">Mes listes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            href="/lists/create"
            className="flex flex-col justify-center rounded-xl border border-xl text-rose-500 border-rose-500 items-center  text-center p-4 cursor-pointer hover:text-red-500 hover:border-red-500"
          >
            Créer une nouvelle liste
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              color=""
              viewBox="0 0 50 50"
            >
              <path
                fill="currentColor"
                d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
              />
              <path fill="currentColor" d="M16 24h18v2H16z" />
              <path fill="currentColor" d="M24 16h2v18h-2z" />
            </svg>
          </Link>

          {lists?.map((list) => <ListCard key={list.id} list={list} />)}
        </div>
      </section>
    </div>
  );
}
