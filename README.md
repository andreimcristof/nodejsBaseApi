# Item Service api
This application is intended as a basic, skeleton node.js API that interacts with a Rethink Database on its endpoints.


### Starting up

In the service-api folder, run these commands:  
**npm install**  (this will install dependencies)  
**nodemon** (this will start app)


### Prerequisites
You will need to have Docker installed, so that you can run a Docker terminal locally, on your machine. Docker can be used on any Operating System.

To install Docker and/or learn about it please visit this page  
https://www.docker.com/


## Characteristics
* This API listens to port 1337, so you can use your favorite REST client to call its endpoints at  
http://localhost:1337/
* The middlewares used are:
    1. *corsHandler* - this allows cross origin resource sharing and should be customised as needed
    2. *cacheHandler* - disables caching on routes
    3. *requestValidator* - this checks that content is application/json if the verb of request is PUT, POST or PATCH.
* Also error logging is toggled according to environmentLevel (see logger.js)
* There is no authentication for the moment, but I can add a jsonwebtoken handler if I get any feedback on this API that someone needs it.
* There is a model validation when creating / updating objects, this
validation can be customised as needed for your objects. The file modelValidation/item.js contains an example of how an object is validated.

## Endpoints

CRUD (create, read, update, delete) operations are offered on the endpoints, as follows:

### /items  
**Purpose** list all  
**Method**  GET  
**Headers**  none  
**Response**  array with items in database, or empty array if none  

### /item/id  
**Purpose** get element with id, where id is uniqueidentifier  
**Method**  GET  
**Headers**  none  
**Response** found element, or empty response if not found  


### /item
**Purpose** create new item  
**Method**  PUT  
**Headers**  Content-Type: application/json  
**Body example**
> ```
{
  "date" :  { "start" : "2016-06-09T15:05:20.160Z", "end" : "2016-06-09T15:05:20.160Z" },
  "content": "YOLO"
}```

**Response:** the inserted item with its ID


### /item
**Purpose** update existing item, where item.id is uniqueidentifier  
**Method**  PATCH  
**Headers**  Content-Type: application/json  
**Body example**
> ```
{
  "id": "4a6593b9-689b-4ccc-ab40-9153bcb222c4",
  "date" :  { "start" : "2016-06-09T15:05:20.160Z", "end" : "2016-06-09T15:05:20.160Z" },
  "content": "updated property"
}```

**Response:** the updated item, or empty response if no corresponding item for that id was found in database


### /item/id  
**Purpose** delete element with id, where id is uniqueidentifier     
**Method**  DELETE  
**Headers**  none  
**Response** summary with operation result





## The local database

This api makes use of a Rethink Database Store, which is injected at startup as a rethinkDbStore object containing the configuration to connect to.
This assumes you have a running rethinkdb Docker container. You can do this with the following command:

`docker run -p=1338:8080 -p=28015:28015 --name=localRethinkDbStore rethinkdb`  
(note that this command requires Docker to be installed, please see the prerequisits section above first).

This command downloads the latest rethinkdb image from the Docker public hub (in case you don't have it already), starts it on local, exposes the administration interface on port 1338 , so you can access your database in the browser at  
http://192.168.99.100:1338/

Once the rethinkdb container is running, note that the API itself uses port 28015 (the RethinkDb default) to communicate. But the administration UI of Rethink can be accessed at the address above.
