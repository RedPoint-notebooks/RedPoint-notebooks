# How to Self-Deploy RedPoint

### 1. Provision a server (We recommend using Ubuntu 18.04 as the OS)

- Use a cloud service like [DigitalOcean](https://www.digitalocean.com/) or [Google Compute Platform](https://cloud.google.com/)
- SSH into the server and ensure the firewall only exposes ports 443 (HTTPS) and 80 (HTTP) to external traffic
- You will likely want to install a text editor like NANO
  - `$ sudo apt-get update`
  - `$ sudo apt-get install nano`

### 2. Install Docker

- [Docker Install Guide](https://docker-curriculum.com/#setting-up-your-computer)

### 3. Install and configure MongoDB

- [MongoDB Install Guide](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04)
- Enable MongoDB password authentication
  - [MongoDB Authentication Guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/)
    <!-- - Daemonize Mongo process (so it runs in the background) -->

### 4. Install and configure Redis

- [Redis Install Guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)
  <!-- - Daemonize Redis process (so it runs in the background) -->
- Enable Redis password authentication
- Create a Redis hashmap "sessions", to store user sessions
  - Enter this variable name in the [.env](./.env)

```
@Ben @Charles need instructions to create redis namespace for rsmq and redis queue
```

### 5. Obtain a domain name and point it at your server's IP address

- Use a service such as [Google Domains](https://domains.google.com/registrar), [GoDaddy](https://www.godaddy.com/) etc...

### 6. Use Certbot to get SSL certificates for domain and wildcard subdomain

- [Follow Steps 1-3 in These Instructions to Install Certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-other)
- Generate the certificate (replace "yourdomain.tld" with your own domain from step #5)
  - `$ certbot-auto certonly --server https://acme-v02.api.letsencrypt.org/directory --manual --preferred-challenges dns -d 'yourdomain.tld,*.yourdomain.tld'`

### 7. Install PM2 To Run The RedPoint Server Processes

- [PM2 Installation Instructions (Only follow steps #1 and #3)](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04)

### 8. Set up Transactional E-mail Service

```
@Ben need your instructions here
```

### 9. Configure the default `env` file, move it to the same directory as `proxyServer.js` and rename it to `.env`

- [Link to .env file](./.env)
- Do not share this file

### 10. Use Docker to pull the latest image from our official RedPoint Notebooks repository on DockerHub:

- `$ sudo docker pull redpointnotebooks/docker`

### 11. Clone the RedPoint proxyServer repository on to your server and install the dependencies:

- `$ git clone https://github.com/redPoint-notebook/reverse-proxy.git`
- `$ npm install`

### 12. Start these process using PM2 (first navigate to the directory they are in):

- `$ pm2 start proxyServer.js`
- `$ pm2 start redisWorker.js`
