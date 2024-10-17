docker-compose pull dynamo-prereqs dynamo-node-server dynamo-envoy dynamo-commonjs-client
docker-compose up --build -d dynamo-prereqs dynamo-node-server dynamo-envoy dynamo-commonjs-client
docker-compose down
docker-compose up --build -d dynamo-commonjs-client

Visit 

localhost:8081/echotest.html