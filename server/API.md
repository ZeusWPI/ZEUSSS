# GET Requests

## /teams

returns:

```json
[
    {
        id: number,
        name: string,
        league: string
    }, ...
]
```

## /teams/{league}

returns:

```json
[
    {
        id: number,
        name: string,
        league: string = league
    }, ...
]
```

## /teams/{id}

returns:

```json
{
    id: number = id,
    name: string,
    league: string
}
```

## /poules

returns:

```json
[
    {
        id: number,
        name: string,
        team: [
            id: number,
            name: string,
            league: string
        ]
    }
]
```

## /poules/{id}

returns:

```json
{
    id: number = id,
    name: string,
    team: [
        id: number,
        name: string,
        league: string,
    ],
    matches: "/poules/{id}/matches"
}
```

## /poules/{id}/matches

returns:

```json
[
    {
        id: number,
        date: Date,
        teams: [
            {
                id: number,
                name: string,
                score: number,
                league: string
            }, ...
        ]
    }
]
```

## /poules/{id}/matches/{matchId}

returns:

```json
{
    id: number = matchId,
    date: Date,
    teams: [
        {
            id: number,
            name: string,
            score: number,
            league: string
        }, ...
    ]
}
```

## /bracket

returns:

```json
{
    rounds: number,
}
```

## /bracket/matches

returns:

```json
[
    {
        id: number,
        parentId: number,
        date: Date,
        teams: [
            {
                id: number,
                name: string,
                score: number,
                league: string,
            }, ...
        ]
    }
]
```

## /bracket/matches/{matchId}

returns:

```json
{
    id: number = matchId,
    parentId: number,
    date: Date,
    teams: [
        {
            id: number,
            name: string,
            score: number,
            league: string,
        }, ...
    ]
}
```

# POST Requests

## /teams

body:

```json
{
    name: string,
    league: string
}
```

returns:

```json
{
    id: number,
    name: string,
    league: string
}
```

## /poules

body:

```json
{
    name: string,
    teams: string[] // ids of the teams
}
```

returns:

```json
{
    id: number,
    name: string,
    team: [
        id: number,
        name: string,
        league: string
    ]
}
```

## /bracket

body:

```json
{
    amount: number // amount of teams
}
```

returns:

```json
{
    rounds: number,
}
```

# PATCH Requests

## /teams/{teamId}

body:

```json
{
    name?: string,
    league?: string
}
```

## /poules/{pouleId}

If old team ids != new team ids, remake poules only if amount of teams is different? make sure no matches played already. If no teams added only change name, dont update mathces.
If only 1 team added, throw error.

body:

```json
{
    name?: string,
    teams?: string[] // team ids
}
```

## /poules/{pouleId}/matches/{matchId}

body:

```json
{
    date?: Date
}
```

## /poules/{pouleId}/matches/{matchId}/{teamId}

body:

```json
{
    score?: number
}
```

## /bracket/matches/{matchId}

body:

```json
{
    teams?: string[] // list of team ids
    date?: Date,
}
```

## /bracket/matches/{matchId}/{teamId}

body:

```json
{
    score?: number,
}
```

# DELETE Requests

## /teams/{teamId}

This only works if the teams is NOT included in any poule or match

## /poules/{pouleId}

This only works if no matches have been played in the poule
