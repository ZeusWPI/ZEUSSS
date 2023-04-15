# GET Requests

## /api/teams

Query parameters:

-   `league` - filter by league (optional)

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

## /api/teams/{id}

returns:

```json
{
    id: number = id,
    name: string,
    league: string
}
```

## /api/poules

returns:

```json
[
    {
        id: number,
        name: string,
        teams: [
            {
                id: number,
                name: string,
                league: string,
                score: number
            }, ...
        ]
    }
]
```

## /api/poules/{id}

returns:

```json
{
    id: number = id,
    name: string,
    teams: [
        {
            id: number,
            name: string,
            league: string
        }, ...
    ],
    matches: "/poules/{id}/matches"
}
```

## /api/poules/{id}/matches

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

## /api/poules/matches?count

will give you the latest `count` amount of matches played in the pool, is usefull for our banner

returns:

```json
[
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
    }, ...
]
```


## /api/poules/{id}/matches/{matchId}

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

## /api/bracket

returns:

```json
{
    rounds: number,
}
```

## /api/bracket/matches

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

## /api/bracket/matches/{matchId}

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

## /api/teams

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

## /api/poules

body:

```json
{
    name: string,
    teams: number[] // ids of the teams
}
```

returns:

```json
{
    id: number,
    name: string,
    teams: [
        id: number,
        name: string,
        league: string
    ]
}
```

## /api/bracket

body:

```json
{
    amount: number // amount of teams
    league: string
}
```

returns:

```json
{
    rounds: number,
}
```

# PATCH Requests

## /api/teams/{teamId}

body:

```json
{
    name?: string,
    league?: string
}
```

## /api/poules/{pouleId}

If old team ids != new team ids, remake poules only if amount of teams is different? make sure no matches played already. If no teams added only change name, dont update mathces.
If only 1 team added, throw error.

body:

```json
{
    name?: string,
    teams?: number[] // team ids
}
```

## /api/poules/{pouleId}/matches/{matchId}

body:

```json
{
    date?: Date,
    scores: {
        [teamId: number]: score
    };
}
```

## /api/bracket/matches/{matchId}

body:

```json
{
    teams?: string[] // list of team ids
    date?: Date,
}
```

## /api/bracket/matches/{matchId}/teams/{teamId}

body:

```json
{
    score?: number,
}
```

# DELETE Requests

## /api/teams/{teamId}

This only works if the teams is NOT included in any poule or match

## /api/poules/{pouleId}

This only works if no matches have been played in the poule
