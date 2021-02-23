# e2e testing
FROM node:14

WORKDIR /home/node/app
COPY . .
RUN yarn install
EXPOSE 3000:3000
CMD yarn start