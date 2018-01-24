### create postgres dbs

sudo adduser horizon
sudo adduser stellar

// create users in postgres, set a password
sudo -i -u postgres
createuser --pwprompt stellar
createuser --pwprompt horizon

// give users createDB powers
ALTER ROLE stellar CREATEROLE CREATEDB;
ALTER ROLE horizon CREATEROLE CREATEDB;

// login to stellar create both dbs
createdb core
createdb coretestnet

// login to stellar create both dbs
createdb horizon
createdb horizontestnet

 
// ======================================================================

docker exec -it stellar /bin/bash

supervisorctl

sudo systemctl restart apache2

// certs found here
/etc/letsencrypt/archive/stellarkit.io/cert1.pem
/etc/letsencrypt/archive/stellarkit.io/privkey1.pem

// ===========================================
// add to horizon.env inside stellar-xxx/horizon/horizon.env

mkdir tls
cp /xx/public.pem ./server.crt
cp /xx/privkey1.pe ./server.key

    export TLS_CERT="/opt/stellar/tls/server.crt"
    export TLS_KEY="/opt/stellar/tls/server.key"
