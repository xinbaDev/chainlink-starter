#!/bin/bash

source common.sh

source cleanup.sh

if [ -f .env.provider ]; then
    rm .env.provider
fi
echo "PROVIDER_HTTP_URL=http://localhost:8545" > .env.provider
echo "PROVIDER_WS_URL=ws://localhost:8545" >> .env.provider

title "1. Building docker image, this may take a while in the first run"
docker build -t chainlink-local-dev .

title "2. Set up local testnet"
docker run -p 8545:8545 --name chainlink-local-testnet -d trufflesuite/ganache-cli >/dev/null
check_docker_run_result
check "checking the testnet..." "testnet setup done" check_testnet 3 

title "3. Generate a wallet if necessary and get some ethers"
if [ ! -f .env.wallet ]; then
    docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
    node scripts/generate-wallet.js
fi
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/get-local-ethers.js

title "4. Deploy linktoken contract to local testnet"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/deploy-linktoken.js
check_docker_run_result

title "5. Generate .env.local file"
docker run --env NODE_ENV='local' --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/generate-envfile.js

title "6. Set up local database"
docker run -p 5432:5432 -d -v chainlink_postgres_volume:/var/lib/postgresql/data -e POSTGRES_PASSWORD=test \
--name chainlink-local-postgres postgres >/dev/null
check_docker_run_result
check "checking the postgres db..." "db setup done" check_db 3

title "7. Set up chainlink node"
cp $(pwd)/credential/.api.example $(pwd)/credential/.api
cp $(pwd)/credential/.password.example $(pwd)/credential/.password

docker run --net=host -v $(pwd)/credential:/chainlink/credential -d --env-file=.env.local --name chainlink-local-node \
smartcontract/chainlink:latest local n -p /chainlink/credential/.password -a /chainlink/credential/.api >/dev/null
check_docker_run_result
check "checking the chainlink node..." "node setup done" check_node 3

title "8. Send some ethers to link node"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/fund-linknode.js
check_docker_run_result

title "9. Deploy oracle contract and set permission for linknode"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-oracle.js
check_docker_run_result

title "10. Deploy test consumer contract and send it some link tokens"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-consumer.js
check_docker_run_result

title "11. Create an example job in chainlink node"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/create-example-job.js
check_docker_run_result
