# Chainlink Starter

> A starter project for deploying a chainlink node and making requests to it

This project is inspired by [airnode-starter](https://github.com/api3dao/airnode-starter) and aims to help people who are new to chainlink to get some first hand experience. It is a demo for ["Running a Chainlink Node"](https://docs.chain.link/docs/running-a-chainlink-node) from the official chainlink doc. I have fun setting it up and it helps me better understand how the system works. I hope it will be the same for you!

## Setup

### On local testnet

1. Clone this repo
2. Install [docker](https://www.docker.com/)
3. Run the following script

```bash
# in the project root folder
./local-setup.sh
```

If everyhing goes well, you can visit http://localhost:6688 and enter the default credential to login. The credential is

```
account: user@test.com
password: password
```

(The credential is stored in credential/.api)

You will see an example job added in the job page.

### On Rinkeby testnet

1. Go to [Infura](https://infura.io/), create an account and get Rinkeby provider URL(one for https, one for websocket)
2. Create/Replace both URL in your `.env.provider` file with the URL you got from Infura

```bash
# it should look something like this
PROVIDER_HTTP_URL=https://rinkeby.infura.io/v3/{YOUR_KEY}
PROVIDER_WS_URL=wss://rinkeby.infura.io/ws/v3/{YOUR_KEY}
```

3. Run the following script

```bash
# in the project root folder
./rinkeby-setup.sh
```

Note: The script will ask you to fund the generated wallet, you can get some free ethers from [https://faucet.rinkeby.io](https://faucet.rinkeby.io)

## Make request

### On local testnet

```bash
# in the project root folder
docker run --env NODE_ENV='local' --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/make-request.js
```

### On Rinkeby testnet

```bash
# in the project root folder
docker run --env NODE_ENV='rinkeby' --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
node scripts/make-request.js
```
