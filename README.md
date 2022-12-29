[![](https://ultragenicglobal.com/wp-content/uploads/2019/12/ultragenic-logo-2-e1575956673631.png)](https://ultragenicglobal.com/)

# UltraAnalytics v1.1(UAN)

## Web Application Backend Server

[![Build Status](https://codebuild.eu-central-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoib2RWa095RmhLMDdjbXZxeEdQeFJzQ2dYbGJZTmg4ZGowNGIwbGZzOVNRYXl0MnlGdTBObng4VHZoalpPUmxzaEw1Wk5oUHRLUzdUR0lXLzJ3bjJsZ0RRPSIsIml2UGFyYW1ldGVyU3BlYyI6Ii9yMHk1dDVBNDVXd25rcisiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=dev)](https://eu-central-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/UG-DEV-Analytics-Backend-API-CodePipeline/view?region=eu-central-1)

This is the backend API server for UltraAnalytics web application.

## Tech

- [node.js](https://nodejs.org/) - Run time environment
- [Express]() - Framework
- [postgres]() - Database
- [TypeORM]() - ORM
- [Winston]() - Logger

## Installation

**Prerequisite**
[Node.js](https://nodejs.org/): v14+
[npm](): v6+

Install the dependencies and devDependencies and start the server.

```sh
npm i
```

## Development

Want to contribute? Great!

**Step 1**

- Ask for the required credentials mentioned in the _.env.example_ file from the main author.

**Step 2**

- Update the values of env variable and rename _.env.example_ to _.env_
- > Note: `.env` is must required for running local server.

**Step 3**

- Run this command and your server should be running successfully

```sh
npm start
```

## Docker

Here are steps to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
docker build -t <youruser>/UAN-API:${package.json.version} .
```

This will create the image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of app mentioned in the package.json file.

Once done, run the Docker image and map the port 3000 of the server to
port 8080 of the Docker

```sh
docker run -d -p 3000:8080 --restart=always --name= <youruser>/UAN-API:${package.json.version}
```

## Important Commands

- Run server with **ts-node** (**Preferred for development**)
  ```
  npm run dev
  ```
- Build code
  ```
  npm run build
  ```
- Sync entity data with database
  ```
  npm run dev:sync
  ```
- `Clear Database`

  ```
  npm run dev:clear
  ```
