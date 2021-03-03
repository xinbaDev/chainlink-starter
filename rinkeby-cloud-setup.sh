#!/bin/bash
# this script is for cloud setup

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

title "4. Send some ethers to chainlink node wallet"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/fund-linknode.js
check_docker_run_result

title "5. Deploy oracle contract and set permission for linknode"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-oracle.js
check_docker_run_result

title "6. Deploy test consumer contract and send it some link tokens"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/setup-consumer.js
check_docker_run_result

title "7. Create an example job in chainlink node"
docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/create-example-job.js
check_docker_run_result