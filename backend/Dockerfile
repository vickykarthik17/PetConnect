# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and project files
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (matches application.properties server.port=8082)
EXPOSE 8082

# Run the JAR file
CMD ["java", "-jar", "target/pet-management-0.0.1-SNAPSHOT.jar"]

