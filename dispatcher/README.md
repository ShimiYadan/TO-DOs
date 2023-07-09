# dispatcher service:
consumes notifications from the REST API by a queue proccess the notifications with a worker
and schedule it by a deadline 

# install node -v 14+ 
you can download it from the official website here https://nodejs.org/en

# install typescript -v 5.1.6
# make sure you install mongodb and rabbitMQ on cloude or on your local machine
# edit the ./env file
# edit the tsconfig.json as you like
# edit the package.json as you like

# install packages
npm i 

# run the service with nodemon - you can change the "main": "./src/server/server.ts" in package.json if you like to run a
# different server file
nodemon





