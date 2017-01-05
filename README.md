# oas-raml-converter-service
rest service to expose oas-raml-converter operations

## Usage

To start the server with default properties:
```bash
npm start
```

To start the server overriding properties:
```bash
SERVER_PORT=5000 SERVER_FORK_BY_CPU=true NODE_ENV=production npm start
```

Available properties:

1. *SERVER_PORT*: server port (default 3000)
2. *SERVER_FORK_BY_CPU*: enable forking a worker for each cpu (default false)
3. *NODE_ENV*: set environment: 'production', 'qa', 'development' (default: 'development')


## Development

Install dependencies:
```bash
npm install
```

Run tests:
```bash
npm test
```

Run eslint check linting errors:
```bash
npm run eslint
```

Run jshint to check linting errors:
```bash
npm run jshint
```

Run eslint and jshint in one command:
```bash
npm run inspections
```
 
See code coverage:
```bash
npm run coverage
```


## Using service

operations:

* `/swagger/to/raml`
* `/raml08/to/raml`
* `/raml/to/swagger`
* `/raml08/to/swagger`

All operations can be used in fourth ways, posting a text/plain or multipart-form of one-to-n files or getting by uri, for instance:

**posting a text/plain**
```
curl -i -H "Content-type: text/plain"  -X POST http://localhost:3000/swagger/to/raml -d '{"swagger":"2.0","info":{"ver...
```

**multipart-form of one-to-n files**

The first file in multipart/form-data parameter will be the root file of the project
```
curl -i  -X POST -F "srcFile=@/tmp/swagger.json" http://localhost:3000/swagger/to/raml
```

An invocation example with multiple files:
```
curl -i  -X POST -F "api.raml=@/myFolder/spec/api.raml" 
-F "types/author.raml=@/myFolder/spec/types/author.raml" 
-F "types/fileContent.raml=@/myFolder/spec/types/fileContent.raml" 
-F "types/fileContents.raml=@/myFolder/spec/types/fileContents.raml" 
-F "types/filePath.raml=@/myFolder/spec/types/filePath.raml" 
-F "types/files.raml=@/myFolder/spec/types/files.raml" 
-F "types/log.raml=@/myFolder/spec/types/log.raml"  
-F "types/logs.raml=@/myFolder/spec/types/logs.raml" http://localhost:3000/raml/to/swagger
```

When using the api with multiple files, we have to take into account that the fileName should be the relative path from the rootFile.

For instance in api.raml we can se something like:

```
types:
  fileContents:           !include types/fileContents.raml
```

When sending _fileContents.raml_, we should send the name like: `types/fileContents.raml`


**multipart-form with zipFile**

Query param _zip-root-file_ must be present with the relative path to the root file

Having a zip _raml.zip_: 

```
api.raml
examples/file.json
examples/files.json
examples/logs.json
examples/save.json
types/author.raml
types/fileContent.raml
types/fileContents.raml
types/filePath.raml
types/files.raml
types/log.raml
types/logs.raml
```
where _api.raml_ is the rootFile a right call to the service is:

```
curl -i  -POST -F "zip=@/tmp/raml.zip" http://localhost:3000/raml/to/swagger?zip-root-file=api.raml
```



More detail in raml spec.
