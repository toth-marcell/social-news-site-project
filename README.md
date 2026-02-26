# Social news site project

## Running website/api server

The server is located in the `web` directory.
You will need to install npm dependencies and copy (and edit) the `.env.example` example config to `.env`. You can then run the server.js file using node.

```bash
cd web
pnpm i
cp .env.example .env
node server.js
```

If you're using the Visual Studio Code IDE, there's a launch config set up for running the server in a debugger.

## Configuration options in .env

- `PORT`: the port to run the server on
- `SECRET`: secret used for jwt signing
- `SITENAME`: the name of the website, used in various places
- `DEFAULT_ADMIN_NAME` and `DEFAULT_ADMIN_PASSWORD`: if the database is empty (newly created), an admin account is created using these details. If one or both of them is empty/not set, this is not done.

## Desktop and Android application

Located in the `app` directory, these are written in Avalonia, and can be built with dotnet, or the Visual Studio IDE.
A browser and ios version is also theoretically supported by the solution, however these are untested as, for the former, there is the "native" website available, and for the latter, I don't use or have any ios devices.
