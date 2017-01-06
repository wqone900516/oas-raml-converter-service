const routes = require('../lib/routes')

const express = require('express')
const request = require('supertest-as-promised')
const app = express()
const chai = require('chai')
chai.use(require('chai-string'));
const expect = chai.expect
const uuidResolver = require('../lib/converter/resolvers/uuiResolver');

class OasRamlConverterTest {

  static convertSwaggerToRaml(swaggerString) {
    return Promise.resolve('convertSwaggerToRaml: ' + swaggerString)
  }

  static convertRamlToRaml(ramlString) {
    return Promise.resolve('convertRamlToRaml: ' + ramlString)
  }

  static convertRamlToSwagger(ramlString) {
    return Promise.resolve('convertRamlToSwagger: ' + ramlString)
  }

  static convertRaml08ToSwagger(ramlString) {
    return Promise.resolve('convertRaml08ToSwagger: ' + ramlString)
  }

  static convertFileSwaggerToRaml(rootFile) {
    return Promise.resolve('convertFileSwaggerToRaml: ' + rootFile)
  }

  static convertFileRamlToRaml(rootFile) {
    return Promise.resolve('convertFileRamlToRaml: ' + rootFile)
  }

  static convertFileRamlToSwagger(rootFile) {
    return Promise.resolve('convertFileRamlToSwagger: ' + rootFile)
  }

  static convertFileRaml08ToSwagger(rootFile) {
    return Promise.resolve('convertFileRaml08ToSwagger: ' + rootFile)
  }

}

routes(app, OasRamlConverterTest)

describe('Routes', function () {
  this.timeout(300)

  it('POST Content /swagger/to/raml', () => {
    return request(app).post('/swagger/to/raml').send('content').set('Content-Type', 'text/plain').expect(200).then((res) => {
      expect(res.text).to.equal('convertSwaggerToRaml: content')
    })
  })

  it('POST Content /raml08/to/raml', () => {
    return request(app).post('/raml08/to/raml').send('content').set('Content-Type', 'text/plain').expect(200).then((res) => {
      expect(res.text).to.equal('convertRamlToRaml: content')
    })
  })

  it('POST Content /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger').send('content').set('Content-Type', 'text/plain').expect(200).then((res) => {
      expect(res.text).to.equal('convertRamlToSwagger: content')
    })
  })

  it('POST Content /raml08/to/swagger', () => {
    return request(app).post('/raml08/to/swagger').send('content').set('Content-Type', 'text/plain').expect(200).then((res) => {
      expect(res.text).to.equal('convertRaml08ToSwagger: content')
    })
  })

  it('POST File /swagger/to/raml', () => {
    return request(app).post('/swagger/to/raml')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/content.txt').expect(200).then((res) => {
        expect(res.text).to.equal('convertSwaggerToRaml: content from file!')
      })
  })

  it('POST File /raml08/to/raml', () => {
    return request(app).post('/raml08/to/raml')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/content.txt').expect(200).then((res) => {
        expect(res.text).to.equal('convertRamlToRaml: content from file!')
      })
  })

  it('POST File /raml/to/swagger', () => {
    return request(app).post('/raml/to/swagger')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/content.txt').expect(200).then((res) => {
        expect(res.text).to.equal('convertRamlToSwagger: content from file!')
      })
  })

  it('POST File /raml08/to/swagger', () => {
    return request(app).post('/raml08/to/swagger')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/content.txt').expect(200).then((res) => {
        expect(res.text).to.equal('convertRaml08ToSwagger: content from file!')
      })
  })

  it('POST File 2 /raml08/to/swagger', () => {
    return request(app).post('/raml08/to/swagger')
      .set('Content-type','multipart/form-data')
      .attach('srcFile', './test/content.txt')
      .attach('srcFile2', './test/content.txt').expect(200).then((res) => {
        expect(res.text).to.startsWith('convertFileRaml08ToSwagger: http://localhost:3000/file/')
        expect(res.text).to.endsWith('/srcFile')
        expect(Object.keys(uuidResolver.map).length).to.equal(0)
      })
  })
})

