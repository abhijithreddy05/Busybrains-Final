FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY ecommerce-app-backend ./ecommerce-app-backend

WORKDIR /app/ecommerce-app-backend

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/ecommerce-0.0.1-SNAPSHOT.jar"]