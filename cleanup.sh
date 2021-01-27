#!/bin/bash

echo "remove chainlink-local-node if exists"
docker rm -f chainlink-local-node >/dev/null 2>&1; 
echo "remove chainlink-local-postgres if exists"
docker rm -f chainlink-local-postgres >/dev/null 2>&1;
echo "remove chainlink-local-testnet if exists"
docker rm -f chainlink-local-testnet >/dev/null 2>&1;
echo "delete chainlink_postgres_volume if exists"
docker volume rm chainlink_postgres_volume >/dev/null 2>&1