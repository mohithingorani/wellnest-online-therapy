import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WELLNEST Backend API",
      version: "1.0.0",
      description: "API documentation for WELLNEST backend services.",
    },
    servers: [
      {
        url: "http://mohit.systems:3000",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "wellnest_session",
        },
      },
      schemas: {
        Specialty: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: ["id", "name", "createdAt"],
        },
        Therapist: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            experience: { type: "integer", minimum: 0 },
            specialities: {
              type: "array",
              items: { $ref: "#/components/schemas/Specialty" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "name",
            "experience",
            "specialities",
            "createdAt",
            "updatedAt",
          ],
        },
        UserPublic: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "email", "name", "createdAt", "updatedAt"],
        },
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
          },
          required: ["success"],
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "object", additionalProperties: true },
          },
          required: ["success", "message"],
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes", "*.ts")],
};

export const openApiSpec = swaggerJSDoc(options);
