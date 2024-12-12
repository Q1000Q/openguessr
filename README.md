# OpenGuessr

## About
This is a free and open-source version of the popular game GeoGuessr for self-hosting. It has all the major features that GeoGuessr has.

## Demo Video

## Requirements
- Server to host it on (standalone or Docker)
- Google Maps API Key (Google provides free $200 credit per month)

## Installation / Configuration

### Docker
1. Install Docker if you don't have it already (Docker Desktop for Windows or Docker Engine for Linux)

2. Clone the repository: `git clone https://github.com/q1000q/openguessr`

3. Go into the project directory: `cd openguessr`

4. Change the name of the `.env.example` file to `.env` and edit the file to contain your API Key

5. Build the Docker image: `docker build -t openguessr .`

6. Run the Docker container: `docker run -d --name openguessr -p 3000:3000 openguessr`

Your instance should be running at port 3000 by default

### Standalone
1. Install Node.js if you don't have it already from [Node.js Downloads](https://nodejs.org/en/download/package-manager)

2. Clone the repository: `git clone https://github.com/q1000q/openguessr`

3. Go into the project directory: `cd openguessr`

4. Install all needed packages: `npm install --legacy-peer-deps`

5. Change the name of the `.env.example` file to `.env` and edit the file to contain your API Key

6. Build the app: `npm run build`

7. Run the app: `npm start`

Your instance should be running at port 3000 by default

