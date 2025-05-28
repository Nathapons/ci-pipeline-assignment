# CI Pipeline Assignment

This repository contains a Node.js Express application with a complete CI/CD pipeline implementation using GitHub Actions.

## Project Overview

This is a simple blog API service built with Express.js that allows users to:
- Retrieve blog posts
- Filter posts by category
- Search posts by keyword
- Paginate through results

The project demonstrates a modern CI/CD workflow with automated testing, code quality analysis, and deployment to Google Cloud Run.

## Tech Stack

- **Backend**: Node.js with Express
- **Testing**: Jest with Supertest
- **Code Quality**: SonarCloud
- **CI/CD**: GitHub Actions
- **Deployment**: Google Cloud Run

## API Endpoints

- `GET /`: Returns query parameters as JSON
- `GET /posts`: Returns blog posts with filtering and pagination
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Number of posts per page (default: 6, max: 100)
    - `category`: Filter by category
    - `keyword`: Search in title, description, content, and category
    - `id`: Get a specific post by ID

## CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline that:

1. **Builds** the application on every push to the main branch
2. **Tests** the application using Jest
3. **Analyzes** code quality using SonarCloud
4. **Deploys** the application to Google Cloud Run

### Pipeline Workflow

```yaml
name: CI Pipeline Assignment

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: Deploy to Cloud Run
        if: ${{ github.event_name == 'push' }}
        # Deployment steps to Google Cloud Run
```

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

1. Clone the repository:
   ```
   git clone git@github.com:Nathapons/ci-pipeline-assignment.git
   cd ci-pipeline-assignment
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run devStart
   ```

4. Run tests:
   ```
   npm test
   ```

## Environment Variables

For deployment, the following secrets need to be configured in GitHub:

- `SONAR_TOKEN`: Token for SonarCloud analysis
- `GCP_SA_KEY`: Google Cloud service account key
- `GCP_PROJECT_ID`: Google Cloud project ID
- `CLOUD_RUN_SERVICE_NAME`: Name of the Cloud Run service
- `GCP_REGION`: Google Cloud region for deployment

## Security Features

- CORS configuration with specific origins and methods
- Request size limiting
- Input validation and sanitization
- Error handling

## License

Nuthapon.S
