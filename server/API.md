# GET Requests

## /teams

```json
[
    {
        id,
        name,
        category
    }, ...
]
```

## /teams/{category}

```json
[
    {
        id,
        name,
        category = category
    }, ...
]
```

## /teams/{id}

```json
{
    id = id,
    name,
    category
}
```

## /poules

```json
[
    {
        id,
        name,
        team: [
            id,
            name,
            category
        ]
    }
]
```

## /poules/{id}

```json
{
    id = id,
    name,
    team: [
        id,
        name,
        category
    ],
    matches: "/poules/{id}/matches"
}
```

## /poules/{id}/matches

```json
[
    {
        id,
        date,
        teams: [
            {
                id,
                name,
                score,
                category
            }, ...
        ]
    }
]
```

## /poules/{id}/matches/{matchId}

```json
{
    id = matchId,
    date,
    teams: [
        {
            id,
            name,
            score,
            category
        }, ...
    ]
}
```

## /bracket

```json
{
    teams: [
        {
            id,
            name,
            category
        }
    ],
}
```

## /bracket/matches

```json
[
    {
        id,
        parentId,
        date,
        teams: [
            {
                id,
                name,
                score,
                category
            }, ...
        ]
    }
]
```

## /bracket/matches/{matchId}

```json
{
    id = matchId,
    parentId,
    date,
    teams: [
        {
            id,
            name,
            score,
            category
        }, ...
    ]
}
```

# POST Requests

## /teams

```json
{
    name,
    category
}
```

returns `id`

## /poules

```json
{
    name,
    teams: [ id, ... ]
}
```

returns `id`

## /bracket/matches

```json
{
    teams: [ id, ... ],
    date,
    parentId
}
```

returns `id`

# PATCH Requests

## /teams

```json
{
    name?,
    category?
}
```

## /poules

If old team ids != new team ids, remake poules? make sure no matches played already. If no teams added only change name, dont update mathces.
If only 1 team added, throw error.

```json
{
    name?,
    teams?: [ id, ... ]
}
```

## /poules/{pouleId}/matches/{matchId}

```json
{
    date?
}
```

## /poules/{pouleId}/matches/{matchId}/{teamId}

```json
{
    score?
}
```

## /bracket/matches/{matchId}

```json
{
    teams?: [ id, ... ],
    date?,
    parentId?
}
```

## /bracket/matches/{matchId}/{teamId}

```json
{
    score?
}
```
