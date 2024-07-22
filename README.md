# Backend

This is a backend service for managing influencers, built using Express.js and MongoDB, with Elasticsearch integration for advanced search capabilities. It allows you to create, search, and retrieve influencer data efficiently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
  - [Create Influencer](#create-influencer)
  - [Search Influencers](#search-influencers)
  - [Get Influencer by ID](#get-influencer-by-id)
  - [Logout](#logout)
- [Index Management](#index-management)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- Create and manage influencer profiles
- Search influencers with full-text search and filters using Elasticsearch
- Retrieve complete influencer data, including related profiles
- Token-based authentication with logout functionality

## Installation

### Prerequisites

- Node.js (>=14.x)
- MongoDB
- Elasticsearch (v7.x or later)

### Clone the Repository

```bash
git clone https://github.com/yourusername/influencer-management-backend.git
cd influencer-management-backend
```

### Install Dependencies

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory and add the following configuration variables:

```env
MONGO_URI=mongodb://localhost:27017/influencers
ELASTICSEARCH_HOST=http://localhost:9200
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Create Influencer

**POST** `/api/influencers`

Creates a new influencer profile.

**Request Body:**

```json
{
  "name": "John Doe",
  "address": "123 Main St",
  "tags": ["influencer", "celebrity"],
  "topics": ["fashion", "lifestyle"]
}
```

**Response:**

- **201 Created:** Returns the created influencer document.
- **400 Bad Request:** If the request body is invalid.

### Search Influencers

**GET** `/api/influencers/search`

Search for influencers using a query string. Supports pagination.

**Query Parameters:**

- `q` (required): Search query.
- `page` (optional): Page number for pagination.
- `size` (optional): Number of results per page.

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/influencers/search?q=John&page=1&size=10"
```

**Response:**

- **200 OK:** Returns an array of search results.

### Get Influencer by ID

**GET** `/api/influencers/:id`

Retrieve the complete document of an influencer by their ID.

**Path Parameters:**

- `id` (required): Influencer ID.

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/influencers/ace81edc-28b7-4e7a-a19e-e564a0ab6314"
```

**Response:**

- **200 OK:** Returns the complete influencer document, with enriched similar profiles.
- **404 Not Found:** If the influencer does not exist.

### Logout

**POST** `/api/logout`

Invalidates the user's authentication token.

**Request Headers:**

- `Authorization` (required): Bearer token.

**Response:**

- **200 OK:** Token successfully invalidated.
- **401 Unauthorized:** If the token is missing or invalid.

## Index Management

### Create Index with Mappings

Create and configure the `influencers` index in Elasticsearch with custom mappings and settings.

**Example Request:**

```bash
curl -X PUT "http://localhost:9200/influencers" -H 'Content-Type: application/json' -d '
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20,
          "token_chars": ["letter", "digit"]
        }
      },
      "analyzer": {
        "edge_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "edge_ngram_tokenizer",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      },
      "address": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      },
      "tags": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      },
      "topics": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      }
    }
  }
}'
```

## Improvement Plans

1. **Elasticsearch Document Sync via Message Broker:**

   - Implement a message broker (e.g., RabbitMQ, Kafka) to listen for changes in the MongoDB database.
   - Automatically index or update documents in Elasticsearch as they are added or modified in MongoDB.

2. **Persistent Database for Blacklisted Tokens:**

   - Integrate a persistent database (e.g., Redis, MongoDB) to store blacklisted tokens.
   - Enhance session management and token invalidation by checking against this database during logout.

3. **Hot Caching with Redis:**
   - Utilize Redis to cache frequently accessed data points.
   - Improve response times and reduce load on MongoDB by storing frequently accessed influencer data in Redis.
