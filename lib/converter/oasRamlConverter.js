const converter = require('oas-raml-converter');

class OasRamlConverter {

  static convertSwaggerToRaml(swaggerString) {
    const swaggerToRaml = new converter.Converter(converter.Formats.SWAGGER, converter.Formats.RAML10);
    var options = {
      validate: false, // Parse the output to check that its a valid document
      format: 'yaml' // Output format: json (default for OAS) or yaml (default for RAML)
    };
    return swaggerToRaml.convertData(swaggerString, options)
  }

  static convertRamlToRaml(ramlString) {
    const ramlToRaml= new converter.Converter(converter.Formats.RAML08, converter.Formats.RAML10)
    var options = {
      validate: false, // Parse the output to check that its a valid document
      format: 'yaml' // Output format: json (default for OAS) or yaml (default for RAML)
    };

    return ramlToRaml.convertData(ramlString, options)
  }

  static convertRamlToSwagger(ramlString) {
    const ramlToSwagger = new converter.Converter(converter.Formats.RAML10, converter.Formats.SWAGGER);
    var options = {
      validate: false, // Parse the output to check that its a valid document
      format: 'json' // Output format: json (default for OAS) or yaml (default for RAML)
    };
    return ramlToSwagger.convertData(ramlString, options)
  }

  static convertRaml08ToSwagger(ramlString) {
    const raml08ToSwagger = new converter.Converter(converter.Formats.RAML08, converter.Formats.SWAGGER);
    var options = {
      validate: false, // Parse the output to check that its a valid document
      format: 'json' // Output format: json (default for OAS) or yaml (default for RAML)
    };

    return raml08ToSwagger.convertData(ramlString,options)
  }

}

module.exports = OasRamlConverter
