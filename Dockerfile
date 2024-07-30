FROM tomcat:8.5.100-jdk21

ARG WAR_FILE=target/cac-0.0.1.war

COPY target/cac-0.0.1.war /usr/local/tomcat/webapps/api.war

EXPOSE 8080

CMD ["catalina.sh", "run"]