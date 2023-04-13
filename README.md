# zeusss
Livesite for SSS

## Server

### Setup local environment
```
cd server/
docker-compose up -d
npx prisma generate
npx prisma db push
```

### Run local environment
```
yarn dev
```
