const converter = require('oas-raml-converter');

class OasRamlConverter {

  static options(validate, format) {
    const options = {}
    if (validate !== undefined) {
      options.validate = validate
    }

    if (format !== undefined) {
      options.format = format
    }

    return options
  }

  static convertSwaggerToRaml(swaggerString, validate, format) {
    const swaggerToRaml = new converter.Converter(converter.Formats.SWAGGER, converter.Formats.RAML10);
    return swaggerToRaml.convertData(swaggerString, OasRamlConverter.options(validate, format))
  }

  static convertRamlToRaml(ramlString, validate, format) {
    const ramlToRaml = new converter.Converter(converter.Formats.RAML08, converter.Formats.RAML10)
    return ramlToRaml.convertData(ramlString, OasRamlConverter.options(validate, format))
  }

  static convertRamlToSwagger(ramlString, validate, format) {
    const ramlToSwagger = new converter.Converter(converter.Formats.RAML10, converter.Formats.SWAGGER);
    return ramlToSwagger.convertData(ramlString, OasRamlConverter.options(validate, format))
  }

  static convertRaml08ToSwagger(ramlString, validate, format) {
    const raml08ToSwagger = new converter.Converter(converter.Formats.RAML08, converter.Formats.SWAGGER);
    return raml08ToSwagger.convertData(ramlString, OasRamlConverter.options(validate, format))
  }

  static convertFileSwaggerToRaml(rootFile, validate, format) {
    const swaggerToRaml = new converter.Converter(converter.Formats.SWAGGER, converter.Formats.RAML10);
    return swaggerToRaml.convertFile(rootFile, OasRamlConverter.options(validate, format))
  }

  static convertFileToRaml(rootFile, validate, format) {
    const swaggerToRaml = new converter.Converter(converter.Formats.AUTO, converter.Formats.RAML10);
    return swaggerToRaml.convertFile(rootFile, OasRamlConverter.options(validate, format))
  }

  static convertFileToSwagger(rootFile, validate, format) {
    const swaggerToRaml = new converter.Converter(converter.Formats.AUTO, converter.Formats.SWAGGER);
    return swaggerToRaml.convertFile(rootFile, OasRamlConverter.options(validate, format))
  }

  static convertToRaml(ramlString, validate, format) {
    const ramlToRaml = new converter.Converter(converter.Formats.AUTO, converter.Formats.RAML10)
    return ramlToRaml.convertData(ramlString, OasRamlConverter.options(validate, format))
  }

  static convertToSwagger(ramlString, validate, format) {
    const ramlToSwagger = new converter.Converter(converter.Formats.AUTO, converter.Formats.SWAGGER);
    return ramlToSwagger.convertData(ramlString, OasRamlConverter.options(validate, format))
  }

  static convertFileRamlToRaml(rootFile, validate, format) {
    const ramlToRaml = new converter.Converter(converter.Formats.RAML08, converter.Formats.RAML10)
    return ramlToRaml.convertFile(rootFile, OasRamlConverter.options(validate, format))
  }

  static convertFileRamlToSwagger(rootFile, validate, format) {
    const ramlToSwagger = new converter.Converter(converter.Formats.RAML10, converter.Formats.SWAGGER);
    return ramlToSwagger.convertFile(rootFile, OasRamlConverter.options(validate, format))
  }

  static convertFileRaml08ToSwagger(rootFile, validate, format) {
    const raml08ToSwagger = new converter.Converter(converter.Formats.RAML08, converter.Formats.SWAGGER);
    return raml08ToSwagger.convertData(rootFile, OasRamlConverter.options(validate, format))
  }

}

module.exports = OasRamlConverter
