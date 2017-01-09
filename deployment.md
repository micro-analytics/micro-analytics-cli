# Deployment

Deploying this service is a short two step process. This assumes you already have a server with an OS of your choice that runs Node setup, if not refer to the [acquiring a server](#acquiring-a-server) section.

1. Upload the files of the service to your server and start the service
2. Setup `nginx` as a reverse proxy to make your service publicy accessible

This is what my `nginx` conf looks like in `/etc/nginx/sites-available/default`:

```nginx
server {
        listen 80;
        server_name yourserver.com;

        location ~^.*$ {
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;
                proxy_pass http://localhost:3000;
        }
}
```

(note that I have no idea what I'm doing here, this was copied from [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-for-apache))

## Acquiring a server

If you don't have a server to deploy this on just yet, here is what I do:

I use and like [DigitalOcean](https://m.do.co/c/d371ed7f99af) (referral link) for my servers. A simple, 5$/month droplet will suffice to run this service reliably. (upgrading to more power in case of big traffic is two clicks away too)

Make sure to choose the `NodeJS x.x.x on 16.04` (where `x.x.x` is the highest version number you can find) one-click app when creating the droplet to get the server fully setup with Node and Ubuntu.
