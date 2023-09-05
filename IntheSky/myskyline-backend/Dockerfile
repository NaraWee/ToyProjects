# Builder stage
FROM gradle:7.6.1-jdk17 as builder
WORKDIR /build

# Cache dependencies
COPY build.gradle settings.gradle /build/
RUN gradle clean build -x test --build-cache --continue --no-daemon > /dev/null 2>&1 || true

# Build
COPY . /build
RUN gradle clean build -x test --build-cache --no-daemon

# Run stage
FROM openjdk:17-alpine as app
WORKDIR /app
COPY --from=builder /build/build/libs/myskyline-0.0.1-SNAPSHOT.jar ./skyline-backend.jar

# Create non-root user group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Run Setup
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "skyline-backend.jar"]
