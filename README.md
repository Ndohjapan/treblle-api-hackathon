# Treblle Hackathon Messaging API

This is a simple messaging api for a chat application.

### Postman Documentation: 
https://documenter.getpostman.com/view/25678847/2s93zFWype#intro

## Project scope

- Users are able to create an account using the `signup` endpoint
- Users can login using the `login` endpoint
- Users can update their firstname and lastname using the `users` endpoint
- Users can establish connection with another user with `connection` endpoint
- Users can also view all their connections using the `connection` endpoint
- Users can send text messages to their connections using the `message` endpoint 
- Users can send visual messages to their connections using the `message` endpoint
- Users can delete messages using the `message` endpoint

## Project requirements

- Automated tests
  - Unit test thoroughly test functionality of each api
- Security Measures
  - Authenticate users using `cookies` and `json web tokens`
  - Give proper authroizations to users and admin
  - Enable user friendly rate limiting for each api


## Setup Development Environment
- ### Create `.env` file
    - Insert Trebble API Key
    - Insert Cloudinary Keys
    ```
    TREBLLE_API_KEY=<your treblle api key>
    TREBLLE_PROJECT_ID=<your treblle project id>
    CLOUD_NAME="<your cloudinary cloud name>"
    CLOUDINARY_KEY="<your cloudinary key>"
    CLOUDINARY_SECRET="<your cloudinary secret>"
    ```
- ### Setup Redis
    You can either set up using docker or on your local computer
    - Using Docker
    ```
    docker run --name message-api-redis  -p 6379:6379 -d redis
    ```
    - Install on your computer: 
    https://redis.io/docs/getting-started/installation/

- ### Setup Mongodb
    You can set up using docker or install on your local computer
    - Using docker
    ```
    docker pull mongo
    docker run --name messag-api-db -p 27017:27017 -d mongo
    ```
    - Install on your computer: https://www.mongodb.com/docs/manual/installation/

- ### Install Node Packages
    ```
    npm install 
    ```    

- ### Start App
    You can start the app immediately using 
    ```
    npm run dev
    ```

    or

    You can populate the database with some users before starting the application
    ```
    npm run seed:up
    npm run dev
    ```

    You will have the following users in your database
    ```
    {
      username: "Ndohjapan",
      firstname: "Joel",
      lastname: "Ndoh",
      password: "P4ssword@"
    },
    {
      username: "Johnny",
      firstname: "David",
      lastname: "George",
      password: P4ssword@"
    },
    ```

    You can also clear the database any time
    ```
    npm run seed:down
    ```
## Setup Test
- ### Create `.env` file
    - Insert Trebble API Key
    - Insert Cloudinary Keys
    ```
    TREBLLE_API_KEY=<your treblle api key>
    TREBLLE_PROJECT_ID=<your treblle project id>
    CLOUD_NAME="<your cloudinary cloud name>"
    CLOUDINARY_KEY="<your cloudinary key>"
    CLOUDINARY_SECRET="<your cloudinary secret>"
    ```
- ### Setup Redis
    You can either set up using docker or on your local computer
    - Using Docker
    ```
    docker run --name message-api-redis  -p 6379:6379 -d redis
    ```
    - Install on your computer: 
    https://redis.io/docs/getting-started/installation/

- ### Setup Mongodb
    You can set up using docker or install on your local computer
    - Using docker
    ```
    docker pull mongo
    docker run --name messag-api-db -p 27017:27017 -d mongo
    ```
    - Install on your computer: https://www.mongodb.com/docs/manual/installation/
     
- ### Start Test
    ```
    npm run test
    ```

