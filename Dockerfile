# --- Etape Build ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .

RUN mvn -f backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/*.war app.war

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]