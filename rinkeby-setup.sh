#!/bin/bash

source common.sh

source cleanup.sh

title "1. Building docker image, this may take a while in the first run"
docker build -t chainlink-local-dev .

title "2. Before continuing the setup process, please make sure the testnet wallet has enough ethers, you can get some free ethers from https://faucet.rinkeby.io"
echo "Your testnet wallet address:" 
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
    node scripts/display-wallet-address.js
read -p "If it is done, press enter to continue"

title "3. Deploy linktoken contract to rinkeby testnet"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/deploy-linktoken.js
check_docker_run_result

title "4. Generate .env.rinkeby file"
docker run --env NODE_ENV='rinkeby' --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/generate-envfile.js

title "5. Set up local database"
docker run -p 5432:5432 -d -v chainlink_postgres_volume:/var/lib/postgresql/data -e POSTGRES_PASSWORD=test \
--name chainlink-local-postgres postgres  >/dev/null
check_docker_run_result
check "checking the postgres db..." "db setup done" check_db 3

title "6. Set up chainlink node"
cp $(pwd)/credential/.api.example $(pwd)/credential/.api
cp $(pwd)/credential/.password.example $(pwd)/credential/.password

docker run --net=host -v $(pwd)/credential:/chainlink/credential -d --env-file=.env.rinkeby --name chainlink-local-node \
smartcontract/chainlink:latest local n -p /chainlink/credential/.password -a /chainlink/credential/.api  >/dev/null
check_docker_run_result
check "checking the chainlink node..." "node setup done" check_node 3

title "7. Send some ethers to link node"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/fund-linknode.js
check_docker_run_result

title "8. Deploy oracle contract and set permission for linknode"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-oracle.js
check_docker_run_result

title "9. Deploy test consumer contract and send it some link tokens"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-consumer.js
check_docker_run_result

title "10. Create an example job in chainlink node"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/create-example-job.js
check_docker_run_result