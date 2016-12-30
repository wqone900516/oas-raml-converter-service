# oas-raml-converter-service
rest service to expose oas-raml-converter operations

## Usage

To start the server with default properties:
```bash
npm start
```

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

All operations can be used in two ways, multipart-form or posting a text/plain, for instance:

```
curl -i  -X POST -F "srcFile=@/tmp/swagger.json" http://localhost:3000/swagger/to/raml
```

```
curl -i -H "Content-type: text/plain"  -X POST http://localhost:3000/swagger/to/raml -d '{"swagger":"2.0","info":{"ver...
```

More detail in raml spec.
