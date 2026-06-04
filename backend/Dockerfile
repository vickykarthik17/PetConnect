# Use Java 17 with Maven pre-installed
FROM eclipse-temurin:17-jdk as builder

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Final stage - Runtime
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the JAR from builder stage
COPY --from=builder /app/target/pet-management-0.0.1-SNAPSHOT.jar app.jar

# Expose port (matches application.properties server.port=8082)
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher || exit 1

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]

