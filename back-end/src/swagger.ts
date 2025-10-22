import { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app: Express) {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "Minha API",
                version: "1.0.0",
                description: "Documentação da API",
            },
            servers: [{ url: "http://localhost:3000" }],
        },
        apis: ["./src/routes/*.ts"],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
