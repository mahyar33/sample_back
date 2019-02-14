## The technology which is used:

 - Node.js , express
 - Highchart
 - Socket.io
 - chai,mocha

## Layered Architecture:

 - Models
 - Controllers
 - Services
 - Routes
You can change your database config in *config* directory.

## How to start the project :

 - `npm install`
 - `npm start`

**Also:**

 - `npm run test` => run test
 - `npm run coverage` => show test coverage
 - `npm run dev`=> watching your files and restrating the server when files
   change

## Dockerizing a node App:

 - `docker build -t [name] .`
 - `docker run -t -i -p 8080:8080 [name]`

