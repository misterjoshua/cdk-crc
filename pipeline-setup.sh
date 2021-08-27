# Start up localstack
docker-compose up -d localstack

# Set up the yarn workspace
npm i -g yarn
yarn

# Wait for localstack to finish coming up if it's not already done
docker-compose up localstack_waiter