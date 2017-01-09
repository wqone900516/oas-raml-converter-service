const mocha = require('mocha')
const chai = require('chai')
chai.use(require('chai-string'));
const expect = chai.expect

const express = require('express')
const request = require('supertest-as-promised')

const app = express()
const OasRamlConverter = require('../../lib/converter/oasRamlConverter')
const routes = require('../../lib/routes')
const config = require('../../lib/config')

describe('Integration', function () {
  before(function (done) {
    // start the server

    routes(app, OasRamlConverter)
    app.listen(config.server.port)
    done();
  });

  it('POST zip /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger?zip-root-file=api.raml')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/integration/resources/raml/raml.zip').expect(200).then((res) => {
        expect(res.text).to.startsWith('{"swagger":"2.0","info":{"version":"0.1","title":"api-designer')
        expect(res.text).to.endsWith('{"type":"string"}}}}}}},"x-basePath":"{host}:{port}/experience/api/v1"}')
      })
  })

  it('POST zip /swagger/to/raml', () => {
    return request(app).post('/swagger/to/raml?zip-root-file=spec/swagger.json')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/integration/resources/swagger/swagger.zip').expect(200).then((res) => {
        expect(res.text).to.startsWith('#%RAML 1.0')
        expect(res.text).to.endsWith('allowedTargets: Method\n')
      })
  })

  it('POST multipleFiles /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger')
      .set('Content-type','multipart/form-data')
      .attach('api.raml', './test/integration/resources/raml/spec/api.raml')
      .attach('types/author.raml', './test/integration/resources/raml/spec/types/author.raml')
      .attach('types/fileContent.raml', './test/integration/resources/raml/spec/types/fileContent.raml')
      .attach('types/fileContents.raml', './test/integration/resources/raml/spec/types/fileContents.raml')
      .attach('types/filePath.raml', './test/integration/resources/raml/spec/types/filePath.raml')
      .attach('types/files.raml', './test/integration/resources/raml/spec/types/files.raml')
      .attach('types/log.raml', './test/integration/resources/raml/spec/types/log.raml')
      .attach('types/logs.raml', './test/integration/resources/raml/spec/types/logs.raml')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('{"swagger":"2.0","info":{"version":"0.1","title":"api-designer')
        expect(res.text).to.endsWith('{"type":"string"}}}}}}},"x-basePath":"{host}:{port}/experience/api/v1"}')
      })
  })

  it('POST multipleFiles validating and yaml /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger?validate=true&format=yaml')
      .set('Content-type','multipart/form-data')
      .attach('api.raml', './test/integration/resources/raml/spec/api.raml')
      .attach('types/author.raml', './test/integration/resources/raml/spec/types/author.raml')
      .attach('types/fileContent.raml', './test/integration/resources/raml/spec/types/fileContent.raml')
      .attach('types/fileContents.raml', './test/integration/resources/raml/spec/types/fileContents.raml')
      .attach('types/filePath.raml', './test/integration/resources/raml/spec/types/filePath.raml')
      .attach('types/files.raml', './test/integration/resources/raml/spec/types/files.raml')
      .attach('types/log.raml', './test/integration/resources/raml/spec/types/log.raml')
      .attach('types/logs.raml', './test/integration/resources/raml/spec/types/logs.raml')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('swagger: \'2.0\'')
        expect(res.text).to.endsWith('x-basePath: \'{host}:{port}/experience/api/v1\'\n')
      })
  })

  it('POST Auto multipleFiles validating and yaml /to/swagger', () => {
    return request(app).post('/to/swagger?validate=true&format=yaml')
      .set('Content-type','multipart/form-data')
      .attach('api.raml', './test/integration/resources/raml/spec/api.raml')
      .attach('types/author.raml', './test/integration/resources/raml/spec/types/author.raml')
      .attach('types/fileContent.raml', './test/integration/resources/raml/spec/types/fileContent.raml')
      .attach('types/fileContents.raml', './test/integration/resources/raml/spec/types/fileContents.raml')
      .attach('types/filePath.raml', './test/integration/resources/raml/spec/types/filePath.raml')
      .attach('types/files.raml', './test/integration/resources/raml/spec/types/files.raml')
      .attach('types/log.raml', './test/integration/resources/raml/spec/types/log.raml')
      .attach('types/logs.raml', './test/integration/resources/raml/spec/types/logs.raml')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('swagger: \'2.0\'')
        expect(res.text).to.endsWith('x-basePath: \'{host}:{port}/experience/api/v1\'\n')
      })
  })

  it('POST multipleFiles /swagger/to/raml', () => {
    return request(app).post('/swagger/to/raml')
      .set('Content-type','multipart/form-data')
      .attach('spec/swagger.json', './test/integration/resources/swagger/spec/swagger.json')
      .attach('spec/NewPet.json', './test/integration/resources/swagger/spec/NewPet.json')
      .attach('spec/parameters.json', './test/integration/resources/swagger/spec/parameters.json')
      .attach('spec/Pet.json', './test/integration/resources/swagger/spec/Pet.json')
      .attach('common/Error.json', './test/integration/resources/swagger/common/Error.json')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('#%RAML 1.0')
        expect(res.text).to.endsWith('allowedTargets: Method\n')
      })
  })

  it('POST AUTO multipleFiles /to/raml', () => {
    return request(app).post('/to/raml').set('Content-type','multipart/form-data')
      .attach('spec/swagger.json', './test/integration/resources/swagger/spec/swagger.json')
      .attach('spec/NewPet.json', './test/integration/resources/swagger/spec/NewPet.json')
      .attach('spec/parameters.json', './test/integration/resources/swagger/spec/parameters.json')
      .attach('spec/Pet.json', './test/integration/resources/swagger/spec/Pet.json')
      .attach('common/Error.json', './test/integration/resources/swagger/common/Error.json')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('#%RAML 1.0')
        expect(res.text).to.endsWith('allowedTargets: Method\n')
      })
  })

  it('POST incomplete multipleFiles /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger')
      .set('Content-type','multipart/form-data')
      .attach('api.raml', './test/integration/resources/raml/spec/api.raml')
      .attach('types/fileContent.raml', './test/integration/resources/raml/spec/types/fileContent.raml')
      .attach('types/fileContents.raml', './test/integration/resources/raml/spec/types/fileContents.raml')
      .attach('types/log.raml', './test/integration/resources/raml/spec/types/log.raml')
      .attach('types/logs.raml', './test/integration/resources/raml/spec/types/logs.raml')
      .expect(200).then((res) => {
        expect(res.text).to.startsWith('{"swagger":"2.0","info":{"version":"0.1","title":"api-designer')
        expect(res.text).to.endsWith(':{"$ref":"#/definitions/can not resolve author.raml"}}}}},"x-basePath":"{host}:{port}/experience/api/v1"}')
      })
  })

  it('POST incomplete multipleFiles /swagger/to/raml', () => {
    return request(app).post('/swagger/to/raml')
      .set('Content-type','multipart/form-data')
      .attach('spec/swagger.json', './test/integration/resources/swagger/spec/swagger.json')
      .attach('spec/NewPet.json', './test/integration/resources/swagger/spec/NewPet.json')
      .attach('spec/Pet.json', './test/integration/resources/swagger/spec/Pet.json')
      .attach('common/Error.json', './test/integration/resources/swagger/common/Error.json')
      .expect(400).then((res) => {
        expect(res.text).to.startsWith('Cannot Convert: Error downloading')
        expect(res.text).to.endsWith('/spec/parameters.json \nHTTP ERROR 400')
      })
  })
})
