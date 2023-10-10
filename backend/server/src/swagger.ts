import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Koodikukkaro Backend API",
            version: "0.1.0",
            description: "A sample API"
        },
        servers: [
            {
                url: "http://127.0.0.1:12345"
            }
        ]
    },
    apis: ["./src/controllers/*.ts"]
};

const swaggerSpecs = swaggerJsDoc(options);

export default swaggerSpecs;
