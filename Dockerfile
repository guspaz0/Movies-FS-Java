FROM tomcat:8.5.100-jdk21

ARG WAR_FILE=target/cac-0.0.1.war

# Deploy as ROOT so the app is served at / (localhost:8080/)
COPY target/cac-0.0.1.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
