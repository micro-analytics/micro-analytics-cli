# Deployment

Deploying this service is a short three step process. This assumes you already have a server with an OS of your choice that runs Node setup, if not refer to the [acquire a server](#acquire-a-server) section.

1. Upload the files of the service to your server (you should be able to do this on your own)
2. Start and daemonize the app with `pm2`
3. Setup `nginx` as a reverse proxy to make your service publicy accessible

## Start and deamonize the app

Once all the files for this microservice are uploaded we'll use `pm2` to start and deamonize the app. This means that the app isn't bound to the terminal, and we'll also make `pm2` start the app when the server start.

First run `npm install -g pm2` to get `pm2`, then run `pm2 start npm -- start`. This tells `pm2` to run `npm start` in the background.

To make sure our service stays up even if the server reboots we run `pm2 startup ubuntu` (replace `ubuntu` with whatever OS you're using) and `pm2 save`.

## Set up `nginx`

Get `nginx` by running `sudo apt-get install nginx`, then configure it to reroute all incoming requests to the server to our server.

Delete the default site from nginx by running `sudo rm /etc/nginx/sites-enabled/default`, then create a new one by running `sudo touch /etc/nginx/sites-enabled/<yoursite>`. (replace `<yoursite>` with your site name)

We want to reroute all requests for any path that come in to our service, so edit the `/etc/nginx/sites-enabled/<yoursite>` file to look like this:

```nginx
server {
  listen 80;
  server_name yoursite.com;

  location ~^.*$ {
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header Host $host;
    proxy_pass http://localhost:3000;
  }
}
```

(note that I have no idea what I'm doing here, this was copied from [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-for-apache))

## Acquire a server

If you don't have a server to deploy this on just yet, here is what I do:

I use and like [DigitalOcean](https://m.do.co/c/d371ed7f99af) (referral link) for my servers. A simple, 5$/month droplet will suffice to run this service reliably. (upgrading to more power in case of big traffic is two clicks away too)

Make sure to choose the `NodeJS x.x.x on 16.04` (where `x.x.x` is the highest version number you can find) one-click app when creating the droplet to get the server fully setup with Node and Ubuntu.
