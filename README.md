# inbucket-frontend
inbucket fontend written in react

<img src="https://raw.githubusercontent.com/somik123/inbucket-frontend/main/screenshot.png" />

<br />

Backend provided by: https://github.com/somik123/inbucket-backend

<br />
<br />

## How to use

### Run frontend with docker compose

Clone to your server, build and run it
```
git clone https://github.com/somik123/inbucket-frontend.git
cd inbucket-frontend
```
<br />

Provide the API domain/host/IP address and list of domains to be used for receive the emails in the .evn file

```
nano .env
```

Replace `https://example.com` on line `1` with your domain, DO NOT end with trailing slash. <br />
Replace `example.com,example1.com,example2.com` on line 2 with your domains, seperated by a single comma and NO SPACES.

```
REACT_APP_API_HOST=https://example.com
REACT_APP_DOMAIN_LIST=example.com,example1.com,example2.com
```

<br />

<br />

Build and run with docker compose
```
docker compose build
docker compose up -d
```

The frontend will be running on port 3080 so point your nginx reverse proxy to this port.

<br />
<br />

### Run backend with docker compose

Use portainer with the following configuration for easy management

with docker compose, run in terminal:
```
mkdir inbucket
cd inbucket
nano docker-compose.yml
```
<br />

Then copy bellow configuration into the file and press Ctrl+x, y, followed by Enter to exit.

```
version: "3"

volumes:
  inbucket_emails:
    name: inbucket_emails

services:
  app:
    container_name: inbucket-backend
    image: somik123/inbucket:main
    restart: unless-stopped
    ports:
      # These ports are in format <host-port>:<container-port>
      - 25:2500 # Mail port
      - 9000:9000 # API port
    environment:
      INBUCKET_LOGLEVEL: "info"
      INBUCKET_MAILBOXNAMING: "full"
      INBUCKET_SMTP_ADDR: "0.0.0.0:2500"
      INBUCKET_SMTP_DOMAIN: "example.com"
      INBUCKET_SMTP_MAXRECIPIENTS: "500"
      INBUCKET_SMTP_MAXMESSAGEBYTES: "10240000"
      INBUCKET_SMTP_DEFAULTACCEPT: "false"
      INBUCKET_SMTP_ACCEPTDOMAINS: "example.com,example1.com,example2.com"
      INBUCKET_SMTP_DEFAULTSTORE: "false"
      INBUCKET_SMTP_STOREDOMAINS: "example.com,example1.com,example2.com"
      INBUCKET_SMTP_TIMEOUT: "20s"
      INBUCKET_POP3_ADDR: "0.0.0.0:1100"
      INBUCKET_POP3_DOMAIN: "hooks.cc"
      INBUCKET_POP3_TIMEOUT: "20s"
      INBUCKET_WEB_ADDR: "0.0.0.0:9000"
      INBUCKET_WEB_UIDIR: "ui"
      INBUCKET_WEB_GREETINGFILE: "defaults/greeting.html"
      INBUCKET_WEB_TEMPLATECACHE: "true"
      INBUCKET_WEB_MAILBOXPROMPT: "@example.com"
      INBUCKET_WEB_COOKIEAUTHKEY: ""
      INBUCKET_WEB_MONITORVISIBLE: "false"
      INBUCKET_WEB_MONITORHISTORY: "20"
      INBUCKET_STORAGE_TYPE: "file"
      INBUCKET_STORAGE_PARAMS: "path:/home/inbucket"
      INBUCKET_STORAGE_RETENTIONPERIOD: "24h"
      INBUCKET_STORAGE_RETENTIONSLEEP: "600s"
      INBUCKET_STORAGE_MAILBOXMSGCAP: "50" 
    volumes:
      - inbucket_emails:/home/inbucket
```
<br />


Followed by

```
docker compose build
docker compose up -d
```


<br />
<br />


## Configurations for nginx reverse proxy 

(includes CORS support in case you want to host them on two seperate servers)
```
location /api{
    if ($request_method = 'OPTIONS') {

        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PATCH, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Accept, Authorization' always;
        add_header Access-Control-Allow-Credentials 'true' always;

        add_header Access-Control-Max-Age 1728000;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
    }

    proxy_pass http://192.168.1.50:9000/api;

    proxy_hide_header Access-Control-Allow-Origin;
    proxy_hide_header Access-Control-Allow-Methods;
    proxy_hide_header Access-Control-Allow-Headers;
    proxy_hide_header Access-Control-Allow-Credentials;

    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, PATCH, PUT, DELETE, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Content-Type, Accept, Authorization' always;
    add_header Access-Control-Allow-Credentials true always;
}


location /serve{
    proxy_pass http://192.168.1.50:9000/serve;

    proxy_hide_header Access-Control-Allow-Origin;
    proxy_hide_header Access-Control-Allow-Methods;
    proxy_hide_header Access-Control-Allow-Headers;
    proxy_hide_header Access-Control-Allow-Credentials;

    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, PATCH, PUT, DELETE, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Content-Type, Accept, Authorization' always;
    add_header Access-Control-Allow-Credentials true always;
}
```
