# 프론트 환경 구성
FROM node:18-alpine AS builder

# 환경 변수 정의
ARG NEXT_PUBLIC_RELEASE_ENV

ENV NEXT_PUBLIC_RELEASE_ENV=$NEXT_PUBLIC_RELEASE_ENV

# apt 필수 패키지 설치
# @sentry/webpack-plugin의 source map 업로드가 curl로 업로드함
RUN apk --no-cache add curl libc6-compat

WORKDIR /app
COPY    ./frontend/package.json  .
COPY    ./frontend/yarn.lock  .
RUN     yarn install
COPY    ./frontend/  .
RUN     yarn build

# 최종 환경 구성
FROM node:18-alpine

# 필수요소 복사
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]