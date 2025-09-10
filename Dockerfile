@"
# Use Maven image for building
FROM maven:3.9.5-openjdk-17-slim AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/shopping-cart-app-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Create data directory for logs
RUN mkdir -p /app/logs

# Run the application
CMD ["java", "-jar", "app.jar"]
"@ | Out-File -FilePath "Dockerfile" -Encoding UTF8