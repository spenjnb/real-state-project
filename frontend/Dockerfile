FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html