const routes = require('../lib/routes')

const express = require('express')
const request = require('supertest-as-promised')
const expect = require('chai').expect
const app = express()

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
})

