FROM n8nregistrywissen.azurecr.io/n8n-java:latest
USER root 
COPY ./n8n-login-node /home/node/.n8n/custom/node_modules/n8n-login-node
COPY ./n8n-nodes-browser-use /home/node/.n8n/custom/node_modules/n8n-nodes-browser-use
USER node
WORKDIR /home/node

