FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# Vite inlines import.meta.env.VITE_* at build time. `npm run start` builds inside
# the container, and .env is (correctly) gitignored — so without these the chat and
# booking endpoints compile to `undefined` and every submission fails.
ARG VITE_BOOKING_URL
ARG VITE_CHATBOT_URL
ENV VITE_BOOKING_URL=$VITE_BOOKING_URL
ENV VITE_CHATBOT_URL=$VITE_CHATBOT_URL

# Fail the image build rather than shipping a site whose only conversion path is dead.
RUN test -n "$VITE_BOOKING_URL" || (echo "VITE_BOOKING_URL build-arg is required" && exit 1)
RUN test -n "$VITE_CHATBOT_URL" || (echo "VITE_CHATBOT_URL build-arg is required" && exit 1)

RUN npm run build
EXPOSE 8081
CMD ["npm","run","preview"]
