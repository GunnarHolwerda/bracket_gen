# bracket_gen
Creates a CLI tool that you provide a title and a json file of your players and 
will generate a Challonge bracket online, with random pairings of your players

## Configuration
Create a [Challonge](https://challonge.com) account and generate your API keys.

Take your keys and create a `config.py` file in the root directory that should look something like this:

```python
CHALLONGE_API_KEY = "..."
CHALLONGE_USERNAME = "..."
```

## Input File Syntax
```json
{ 
  "players": [
    {"name": "example"}
  ], 
  "teams": []
}
```

The players array contains a list of object with name properties.
If you want a team to not be created at random, add them to the strings array.

## Output
On completion it will print out your challonge url to your bracket.
