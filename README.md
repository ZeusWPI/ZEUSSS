# zeusss
Livesite for SSS

## Install dependecies

```bash
asdf install
```

## Webgui

```bash
cd webgui
yarn install
yarn build
```

## Server

```bash
cd server

# Setup database
docker-compose up -d
npx prisma generate
npx prisma db push

yarn install
yarn build
yarn start
```
