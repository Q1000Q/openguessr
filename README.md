# OpenGuessr

## About
This is a free and open-source version of the popular game GeoGuessr for self-hosting. It has all the major features that GeoGuessr has.

## Demo Video
[![](https://markdown-videos-api.jorgenkh.no/youtube/pg1zqGahacE)](https://youtu.be/pg1zqGahacE)

## Requirements
- Server to host it on (standalone or Docker)
- Google Maps API Key (Google provides free $200 credit per month)

## Installation / Configuration

### Docker
1. Install Docker if you don't have it already (Docker Desktop for Windows or Docker Engine for Linux)

2. Clone the repository: `git clone https://github.com/q1000q/openguessr`

3. Go into the project directory: `cd openguessr`

4. Change the name of the `.env.example` file in `/client` directory to `.env` and edit the file to contain your API Key

5. Build the Docker image: `docker build -t openguessr .`

6. Run the Docker container: `docker run -d --name openguessr -p 3000:3000 openguessr`

Your instance should be running at port 3000 by default