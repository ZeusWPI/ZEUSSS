FROM node:18-alpine AS frontend_build

WORKDIR /webui

COPY ./webui/package.json ./
COPY ./webui/package-lock.json ./
RUN yarn install

COPY ./webui ./
RUN yarn run build

FROM node:18-alpine AS zeusss_server

WORKDIR /zeusss

COPY ./server/package.json ./
COPY ./server/package-lock.json ./
RUN yarn install

COPY ./server ./
RUN yarn run build

CMD [ "yarn", "run", "start" ]