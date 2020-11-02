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
- Create name for user sessions hashmap in the [env](./env)

### 5. Obtain a domain name and point it at your server's IP address

- Use a service such as [Google Domains](https://domains.google.com/registrar), [GoDaddy](https://www.godaddy.com/) etc...

### 6. Use Certbot to get SSL certificates for domain and wildcard subdomain

- [Follow Steps 1-3 in These Instructions to Install Certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-other)
- Generate the certificate (replace "yourdomain.tld" with your own domain from step #5)
  - `$ certbot certonly --server https://acme-v02.api.letsencrypt.org/directory --manual --preferred-challenges dns -d 'yourdomain.tld,*.yourdomain.tld'`

### 7. Install PM2 To Run The RedPoint Server Processes

- [PM2 Installation Instructions (Only follow steps #1 and #3)](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04)

### 8. Set up SendGrid (Transactional E-mail Provider)

- [Generate a SendGrid API key](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#managing-api-keys) and enter it in the [env](./env)
- Optionally, [set up domain authentication](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/) for your domain

### 9. Configure the default `env` file, move it to the same directory as `proxyServer.js` and rename it to `.env`

- [Link to env file](./.env)
- Be sure to .gitignore this file in production

### 10. Use Docker to pull the latest image from our official RedPoint Notebooks repository on DockerHub:

- `$ sudo docker pull redpointnotebooks/docker`

### 11. Clone the RedPoint proxyServer repository on to your server and install the dependencies:

- `$ git clone https://github.com/redPoint-notebook/reverse-proxy.git`
- `$ npm install`

### 12. Start these processes using PM2 (first navigate to the directory they are in):

- `$ pm2 start proxyServer.js`
- `$ pm2 start redisWorker.js`
