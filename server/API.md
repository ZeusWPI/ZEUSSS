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

## /api/poules/matches?count&league

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

## /api/bracket/{league}

returns:

```json
{
    rounds: number,
    id: number,
}
```

## /api/bracket/matches

returns:

```json
[
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
]
```

# POST Requests

## /api/admin/teams

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

## /api/admin/poules

body:

```json
{
    name: string,
    league: string,
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

## /api/admin/bracket

body:

```json
{
    amount: number // amount of teams
    league: string
}
```

# PATCH Requests

## /api/admin/teams/{teamId}

body:

```json
{
    name?: string,
    league?: string
}
```

## /api/admin/poules/{pouleId}

If old team ids != new team ids, remake poules only if amount of teams is different? make sure no matches played already. If no teams added only change name, dont update mathces.
If only 1 team added, throw error.

body:

```json
{
    name?: string,
    teams?: number[] // team ids
}
```

## /api/admin/poules/{pouleId}/matches/{matchId}

body:

```json
{
    date?: Date,
    scores: {
        [teamId: number]: score
    };
}
```

## /api/admin/bracket/matches/{matchId}

body:

```json
{
    teams?: number[] // list of team ids
    date?: Date,
}
```

## /api/admin/bracket/matches/{matchId}/teams/{teamId}

body:

```json
{
    score?: number,
}
```

# DELETE Requests

## /api/admin/teams/{teamId}

This only works if the teams is NOT included in any poule or match

## /api/admin/poules/{pouleId}

This only works if no matches have been played in the poule
