FROM node:18-alpine AS frontend_build

WORKDIR /webui

COPY ./webui/package.json ./
COPY ./webui/yarn.lock ./
RUN yarn install

COPY ./webui ./
RUN yarn run build

FROM node:18-alpine AS zeusss_server

WORKDIR /zeusss

COPY ./server/package.json ./
COPY ./server/yarn.lock ./
RUN yarn install

COPY ./server ./
COPY --from=frontend_build /webui/dist ./public
RUN yarn run build

CMD [ "yarn", "run", "start" ]
