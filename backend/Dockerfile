FROM openjdk:11

VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=build/libs/thread-java-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} java-backend.jar
ENTRYPOINT ["java","-jar","/java-backend.jar"]
