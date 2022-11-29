# pickupSoccer

MERN full stack web application. Work in progress. Currently works great. Just needs more features. 

Will slowly add more while looking for job. 


To run this app, download the repo, then add .env to
soccer-server and define the following variables:

SECRET=putYourSecretHere
dbConnect=mongodb+srv:/username:password@cluster0.lutkd9u.mongodb.net/YourDBName
WHITELISTED_DOMAINS = http://localhost:3000, http://localhost:8080
COOKIE_SECRET=putYourSecretHere
JWT_SECRET=putYourSecretHere

NOTE: you should define whitelisted domains EXACTLY the same
You'll need a mongoDB database account. Once you're db is created  !!! MAKE SURE !!! your ip
settings allow for requests to your db from anywhere. Change the string I show above for dbConnect appropriately.

cd into soccer-client. 
run: 
$ npm i
wait till its done, then:
cd soccer-server
again: 
$ npm i
wait, then: 
cd ..
$ npm start


This will run both the client and the server because of how everything is set up. Enjoy!
