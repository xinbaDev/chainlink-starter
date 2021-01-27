#!/bin/bash

if [ ! -x "$(command -v docker)" ]; then
    echo "Please install docker before running the script"
    exit
fi

title() {
    echo ""
    echo $1
}

check_docker_run_result() {
    OUT=$?
    if [ ! $OUT -eq 0 ] ; then
        echo "Set up fail."
        exit
    fi
}

check_testnet() {
    curl --silent --output /dev/null -H "Content-Type: application/json" -X POST --data \
        '{"id":1337,"jsonrpc":"2.0","method":"net_version"}' \
        http://localhost:8545 

    return $?
}

check_db() {
    docker exec chainlink-local-postgres pg_isready >/dev/null
    return $?
}

check_node() {
    curl --silent --output /dev/null http://localhost:6688
    return $?
}

check() {
    echo $1
    while :
    do
        $3
        if [ "$?" -eq "0" ]
        then
            echo $2
            break
        fi
        sleep $4
    done
}

if [ ! -f ./credential/.api ]; then
    echo "user@test.com" > ./credential/.api
    echo "password" >> ./credential/.api
fi

if [ ! -f ./credential/.password ]; then
    echo "test" > ./credential/.password
fi

if [ ! -f .env.wallet ]; then
    docker run --net=host -v $(pwd):/chainlink-dev/ -it chainlink-local-dev \
    node scripts/generate-wallet.js
fi