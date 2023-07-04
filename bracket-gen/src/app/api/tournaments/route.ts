import { NextResponse, NextRequest } from 'next/server'
import challonge from "challonge";

const client = challonge.createClient({
    apiKey: process.env.CHALLONGE_API_KEY,
});

/**
 * Selects, removes, and returns a random player from the array
 * @param players 
 */
const getRandomPlayer = (players: string[]): string => {
    if (players.length === 0) {
        throw new Error('No players supplied')
    }

    const randomIndex = Math.floor(Math.random() * players.length);
    const player = players[randomIndex];
    players.splice(randomIndex, 1);
    return player;
}

const createTeams = (participants: string[]): string[] => {
    if (participants.length % 2 !== 0) {
        throw new Error('Odd number of players supplied')
    }

    const teams: string[] = [];
    while (participants.length > 0) {
        const playerOne = getRandomPlayer(participants);
        const playerTwo = getRandomPlayer(participants);
        teams.push(`${playerOne} and ${playerTwo}`);
    }

    return teams;
}


const createChallongeTournament = (name: string) => {
    return new Promise((res, rej) => {
        client.tournaments.create({
            tournament: {
                name,
                open_signup: false,
            },
            callback: (err: Error, data: unknown) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(data);
            }
        })
    })
};

const addParticipant = (tournamentId: string, name: string) => {
    return new Promise((res, rej) => {
        client.participants.create({
            id: tournamentId,
            participant: {
                name
            },
            callback: (err: Error, data: unknown) => {
                if (err) {
                    rej(err);
                    return;
                }

                res(data);
            }
        });
    })
}


export async function POST(req: NextRequest) {
    const { players, tournamentName } = await req.json() as { players: string[], tournamentName: string };
    const teams = createTeams(players);

    const tournament: any = await createChallongeTournament(tournamentName);

    for (const team of teams) {
        await addParticipant(tournament.tournament.id, team);
    }

    return NextResponse.json({
        tournamentId: tournament.tournament.id
    });
}