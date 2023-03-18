const express = require("express");
const app = express();
const { Pool } = require('pg');
const bodyParser = require("body-parser");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const AlbumsRouter = require('./routes/albumRoutes');
const AuthRouter = require('./routes/authRoute');
const { albumModel, userModel } = require('./Config/dbconfig');

const Redis = require("ioredis");

var router = express.Router();
var corOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corOptions));
app.use(bodyParser.json()); // before our routes definition
app.use(bodyParser.urlencoded({ extended: true }));

app.use(AlbumsRouter);
app.use('/api/auth', AuthRouter);

app.use(albumModel);
app.use(userModel);

// connect database
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'mydb',
//   password: 'postgres',
//   port: 5432, // or the port number of your database
// });
app.use(express.json());

// Khởi tạo Redis Client
const redis = new Redis({
    host: "127.0.0.1", // Địa chỉ Redis Server
    port: 6379, // Cổng Redis Server
  });
  
  // Kiểm tra trạng thái Redis Client
  if (redis.status === "connecting" || redis.status === "connected") {
    console.log("Redis Client is already connecting/connected");
  } else {
    // Kết nối đến Redis Server
    redis.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Redis connected");
      }
    });
  }

redis.quit();
// swagger setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/albums': {
            get: {
                tags: ['Albums'],
                description: 'Get all albums',
                operationId: 'getAlbums',
                parameters: [],
                responses: {
                    '200': {
                        description: 'Albums were obtained',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Album',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
            post: {
                tags: ['Albums'],
                description: 'Create album',
                operationId: 'createAlbum',
                parameters: [],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Album',
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    '201': {
                        description: 'Album created',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Album',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
        },
        '/albums/{id}': {
            get: {
                tags: ['Albums'],
                description: 'Get album by id',
                operationId: 'getAlbumById',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of album to return',
                        required: true,
                        schema: {
                            type: 'integer',
                            format: 'int64',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Album obtained',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Album',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Album not found',
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
            put: {
                tags: ['Albums'],
                description: 'Update album',
                operationId: 'updateAlbum',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of album to update',
                        required: true,
                        schema: {
                            type: 'integer',
                            format: 'int64',
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Album',
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    '200': {
                        description: 'Album updated',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Album',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Album not found',
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
            delete: {
                tags: ['Albums'],
                description: 'Delete album',
                operationId: 'deleteAlbum',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of album to delete',
                        required: true,
                        schema: {
                            type: 'integer',
                            format: 'int64',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Album deleted',

                    },
                    '404': {
                        description: 'Album not found',
                    },
                    '500': {
                        description: 'Server error',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Album: {
                type: 'object',
                properties: {
                    albumId: {
                        type: 'integer',

                    },
                    artistName: {
                        type: 'string',

                    },
                    collectionName: {
                        type: 'string',
                    },
                    artworkUrl100: {
                        type: 'string',
                    },
                    releaseDate: {
                        type: 'string',
                    },
                    primaryGenreName: {
                        type: 'string',
                    },
                    url: {
                        type: 'string',
                    },
                },
            },
        },
    },

};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// routes
// app.use(AlbumsRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
