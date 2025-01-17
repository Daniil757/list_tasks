FROM alpine
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 5500
CMD ["yarn", "nodemon"]