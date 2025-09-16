FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/shopping-cart-app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
RUN mkdir -p /app/logs
CMD ["java", "-jar", "app.jar"]
