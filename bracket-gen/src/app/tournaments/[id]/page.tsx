import challonge from "challonge";

const client = challonge.createClient({
  apiKey: process.env.CHALLONGE_API_KEY,
});

async function getTournamentDetails(tournamentId: string) {
  return new Promise<{ tournament: { fullChallongeUrl: string } }>(
    (resolve, reject) => {
      client.tournaments.show({
        id: tournamentId,
        callback: (
          err: Error,
          data: { tournament: { fullChallongeUrl: string } }
        ) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        },
      });
    }
  );
}

export default async function TournamentDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const details = await getTournamentDetails(id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full h-[75vw] items-center justify-between lg:flex">
        <iframe
          className="w-full h-full"
          src={`${details.tournament.fullChallongeUrl}/module`}
        />
      </div>
    </main>
  );
}
