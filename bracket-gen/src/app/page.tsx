"use client";
import Head from "next/head";
import { useCallback, useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const createTournament = useCallback(async () => {
    const response = await fetch(`/api/tournaments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players,
        tournamentName: name,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { tournamentId } = (await response.json()) as {
      tournamentId: string;
    };

    window.location.href = `/tournaments/${tournamentId}`;
  }, [players, name]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="flex flex-col justify-between w-full">
          <div className="mt-8">
            <label
              htmlFor="name"
              className="block text-lg font-medium leading-6 text-gray-900"
            >
              Tournament Name
            </label>
            <div className="mt-2">
              <input
                type="name"
                name="name"
                id="name"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Fourth of July Tournament"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>
          <div className="mt-8">
            <label
              htmlFor="players"
              className="block text-lg font-medium leading-6 text-gray-900"
            >
              Enter Names of Players
            </label>
            <div className="mt-2">
              <textarea
                name="players"
                id="players"
                placeholder="One name per line"
                className="block w-full h-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
                onChange={(event) => setPlayers(event.target.value.split("\n"))}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={createTournament}
            className="mt-8 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Create
          </button>
        </div>
      </div>
    </main>
  );
}
