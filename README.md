# Blog API

A RESTful API for managing blog posts with pagination, filtering, and search capabilities.

## Features

- Get all blog posts with pagination
- Filter posts by category
- Search posts by keyword
- Get individual post details
- CORS protection
- Error handling
- CI/CD pipeline with GitHub Actions
- Code quality analysis with SonarCloud

## Tech Stack

- Node.js
- Express.js
- Jest (Testing)
- GitHub Actions (CI/CD)
- SonarCloud (Code Quality)
- Vercel (Deployment)

## API Endpoints

### Get all posts
```
GET /posts
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of posts per page (default: 6, max: 100)
- `category`: Filter by category
- `keyword`: Search in title, description, content, and category

Response:
```json
{
  "totalPosts": 30,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 6,
  "posts": [...],
  "nextPage": 2
}
```

### Get a specific post
```
GET /posts/:id
```

Response:
```json
{
  "id": 1,
  "image": "https://example.com/image.jpg",
  "category": "General",
  "title": "Post Title",
  "description": "Post description",
  "author": "Author Name",
  "date": "2024-09-11T00:00:00.000Z",
  "likes": 321,
  "content": "Post content..."
}
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ci-pipeline-assignment
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

The server will run on port 4001 by default or the port specified in the PORT environment variable.

## Development

Start the server with hot-reload:
```bash
npm run devStart
```

## Testing

Run tests with Jest:
```bash
npm test
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. Checkout code
2. Set up Node.js environment
3. Install dependencies
4. Run tests
5. Deploy to production
6. Run SonarCloud analysis for code quality

## Deployment

The API is configured for deployment on Vercel using the configuration in `vercel.json`.

## License

ISC