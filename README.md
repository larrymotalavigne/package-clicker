# Package Clicker - FedEx Edition

A fun incremental clicker game themed around FedEx package delivery operations.

## Development server

Open `index.html` in your browser to run the game locally. The application is a static web app with vanilla HTML, CSS, and JavaScript.

## Docker Development

Build the Docker image:
```bash
docker build -t packageclicker .
```

Run with Docker:
```bash
docker run -p 8080:80 packageclicker
```

## Docker Compose

Run the application using Docker Compose:
```bash
docker compose up -d
```

The application will be available at `http://localhost:1003`

## Production Deployment

The project includes CI/CD pipeline configuration for automatic deployment:
- Builds Docker image on push to main/develop branches
- Pushes to private registry
- Deploys to UNRAID server via SSH

## Game Features

- Click packages to earn points
- Purchase upgrades to automate package delivery
- Unlock achievements as you progress
- FedEx-themed graphics and terminology