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

### to init dbs

export DATABASE_URL="postgres://horizon:taro@localhost/horizon?sslmode=disable"
 horizon db init

export DATABASE_URL="postgres://horizon:taro@localhost/horizontestnet?sslmode=disable"
 horizon db init

stellar-core --conf /etc/stellar/stellar-core.cfg --newdb
stellar-core --conf /etc/stellar/stellar-core-testnet.cfg --newdb

### to switch between live and testnet

sudo systemctl stop stellar-core
sudo systemctl stop horizon
sudo systemctl disable stellar-core
sudo systemctl disable horizon

sudo systemctl enable stellar-core-testnet
sudo systemctl enable horizon-testnet

### folders used for install

/etc/stellar
/etc/stellar/stellar-core.cfg
/etc/stellar/stellar-core-testnet.cfg
/lib/systemd/system/stellar-core.service
/var/stellar
/var/stellar/buckets/
/var/stellar/buckets-testnet/
/var/stellar/log


// ======================================================================

docker exec -it stellar /bin/bash

supervisorctl

sudo systemctl restart apache2

// certs found here
/etc/letsencrypt/archive/stellarkit.io/cert1.pem
/etc/letsencrypt/archive/stellarkit.io/privkey1.pem


// ===========================================
// mainnet

// run first time to set password on postgres
docker run -it --rm \
    -v "/home/steve/stellar-main:/opt/stellar" \
    --name stellar \
    stellar/quickstart --pubnet

docker run -d --restart unless-stopped \
    -v "/home/steve/stellar-main:/opt/stellar" \
    -p "8000:8000" \
    --name stellar \
    stellar/quickstart --pubnet


// ===========================================
// testnet

// run first time to set password on postgres
docker run -it --rm \
    -v "/home/steve/stellar-test:/opt/stellar" \
    --name stellar \
    stellar/quickstart --testnet

docker run -d --restart unless-stopped \
    -v "/home/steve/stellar-test:/opt/stellar" \
    -p "8000:8000" \
    --name stellar \
    stellar/quickstart --testnet


// ===========================================
// add to horizon.env inside stellar-xxx/horizon/horizon.env

mkdir tls
cp /xx/public.pem ./server.crt
cp /xx/privkey1.pe ./server.key

    export TLS_CERT="/opt/stellar/tls/server.crt"
    export TLS_KEY="/opt/stellar/tls/server.key"
