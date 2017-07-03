"""
Generates a challonge tournament
"""
import json
import random
import string
import challonge
import click
from config import CHALLONGE_API_KEY, CHALLONGE_USERNAME


def randomword(length):
    """ Generates a random string """
    return ''.join(random.choice(string.lowercase) for i in range(length))


def get_random_player(players):
    """
        Selects, removes, and returns a random player from the array
    """
    player = random.choice(players)
    players.remove(player)
    return player['name']


def create_teams(teamdict):
    """ Creates pairs of players from an array of players """
    teams = []
    participants = teamdict['players'][:]
    while participants:
        player_one = get_random_player(participants)
        player_two = get_random_player(participants)
        teams.append(' & '.join([player_one, player_two]))

    pre_gen_teams = teamdict['teams'][:]
    for team in pre_gen_teams:
        teams.append(team)

    random.shuffle(teams)
    return teams


def generate_participants(tournament_url, teams):
    """ Generates participants for the tournament """
    for team in teams:
        challonge.participants.create(tournament_url, team)


@click.command()
@click.argument('name')
@click.argument('filename')
def tournament(name, filename):
    """
        Generates a Challonge bracket for the tournament
    """
    teams_file = open(filename)
    teams = json.load(teams_file)
    teams_file.close()
    tourny = challonge.tournaments.create(
        name, randomword(10), open_signup=False)
    teams = create_teams(teams)
    generate_participants(tourny['url'], teams)
    click.echo('Tourny created with participants: %s' %
               tourny['full-challonge-url'])


if __name__ == '__main__':
    challonge.set_credentials(
        CHALLONGE_USERNAME, CHALLONGE_API_KEY)
    tournament()
