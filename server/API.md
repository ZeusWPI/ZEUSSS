# GET Requests

## /teams

```json
[
    {
        id: number,
        name: string,
        category: string
    }, ...
]
```

## /teams/{category}

```json
[
    {
        id: number,
        name: string,
        category: string = category
    }, ...
]
```

## /teams/{id}

```json
{
    id: number = id,
    name: string,
    category: string
}
```

## /poules

```json
[
    {
        id: number,
        name: string,
        team: [
            id: number,
            name: string,
            category: string
        ]
    }
]
```

## /poules/{id}

```json
{
    id: number = id,
    name: string,
    team: [
        id: number,
        name: string,
        category: string,
    ],
    matches: "/poules/{id}/matches"
}
```

## /poules/{id}/matches

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
                category: string
            }, ...
        ]
    }
]
```

## /poules/{id}/matches/{matchId}

```json
{
    id: number = matchId,
    date: Date,
    teams: [
        {
            id: number,
            name: string,
            score: number,
            category: string
        }, ...
    ]
}
```

## /bracket

```json
{
    rounds: number,
}
```

## /bracket/matches

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
                category: string,
            }, ...
        ]
    }
]
```

## /bracket/matches/{matchId}

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
            category: string,
        }, ...
    ]
}
```

# POST Requests

## /teams

```json
{
    name: string,
    category: string
}
```

returns `id: number`

## /poules

```json
{
    name: string,
    teams: string[] // ids of the teams
}
```

returns `id: number`

## /bracket

```json
{
    amount: number // amount of teams
}
```

returns `null`

# PATCH Requests

## /teams

```json
{
    name?: string,
    category?: string
}
```

## /poules

If old team ids != new team ids, remake poules only if amount of teams is different? make sure no matches played already. If no teams added only change name, dont update mathces.
If only 1 team added, throw error.

```json
{
    name?: string,
    teams?: string[] // team ids
}
```

## /poules/{pouleId}/matches/{matchId}

```json
{
    date?: Date
}
```

## /poules/{pouleId}/matches/{matchId}/{teamId}

```json
{
    score?: number
}
```

## /bracket/matches/{matchId}

```json
{
    teams?: string[] // list of team ids
    date?: Date,
}
```

## /bracket/matches/{matchId}/{teamId}

```json
{
    score?: number,
}
```
