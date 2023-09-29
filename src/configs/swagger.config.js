import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger API',
      version: '1.0.0',
      description: 'E-commerce APIs'
    },
    servers: [
      {
        url: 'http://localhost:3055'
      }
    ]
  },
  apis: [
    path.join(__dirname, '../swagger/*.yaml'),
    path.join(__dirname, '../swagger/**/*.yaml'),
    path.join(__dirname, '../src/swagger/*.yaml'),
    path.join(__dirname, '../src/swagger/**/*.yaml')
  ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerOptions, swaggerDocs };
