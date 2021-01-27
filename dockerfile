FROM node:alpine AS BUILD_IMAGE

WORKDIR /chainlink-dev

COPY package*.json /chainlink-dev/

RUN npm install


FROM node:alpine

WORKDIR /chainlink-dev

COPY --from=BUILD_IMAGE /chainlink-dev/node_modules /node_modules

CMD ["npx"]