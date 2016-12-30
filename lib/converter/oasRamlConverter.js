const converter = require('oas-raml-converter');

class OasRamlConverter {

  cunstructor() {
    this.swaggerToRaml = new converter.Converter(converter.Formats.SWAGGER, converter.Formats.RAML10);
    this.ramlToSwagger = new converter.Converter(converter.Formats.RAML10, converter.Formats.SWAGGER);
    this.raml08ToSwagger = new converter.Converter(converter.Formats.RAML08, converter.Formats.SWAGGER);
    this.ramlToRaml= new converter.Converter(converter.Formats.RAML08, converter.Formats.RAML10);
  }

  convertSwaggerToRaml(swaggerString) {
    return swaggerToRaml.convertData(swaggerString)
  }

  convertRamlToRaml(ramlString) {
    return ramlToRaml.convertData(swaggerString)
  }

  convertRamlToSwagger(ramlString) {
    return ramlToSwagger.convertData(swaggerString)
  }

  convertRaml08ToSwagger(ramlString) {
    return raml08ToSwagger.convertData(swaggerString)
  }

}