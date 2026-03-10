import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AWS Student Community Day API',
            version: '1.0.0',
            description: 'API documentation for the AWS Student Community Day event platform.',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string' },
                        role: { type: 'string', enum: ['ATTENDEE', 'SPEAKER', 'ADMIN'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Attendee: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        university: { type: 'string' },
                        tshirtSize: { type: 'string' },
                        checkedIn: { type: 'boolean' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
