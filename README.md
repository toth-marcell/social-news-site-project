# Social news site project

https://social-news.toth-marcell.xyz/

## Running website/api server

The server is located in the `web` directory.
You will need to install (p)npm dependencies and copy (and edit) the `.env.example` example config to `.env`. You can then run the web server either by `pnpm start` for production or `pnpm dev` for a dev server which watches file changes.

```bash
cd web
pnpm i
cp .env.example .env
pnpm start
```

## Configuration options in .env

- `PORT`: the port to run the server on
- `SECRET`: secret used for jwt signing
- `SITENAME`: the name of the website, used in various places
- `DEFAULT_ADMIN_NAME` and `DEFAULT_ADMIN_PASSWORD`: at startup, an admin account is created using these details. If one or both of them is empty/not set, this is not done. It is also not done if there is already an user with the given name.

## Desktop and Android application

Located in the `app` directory, these are written in Avalonia, and can be built with dotnet, or the Visual Studio IDE.
A browser and ios version is also theoretically supported by the solution, however these are untested as, for the former, there is the "native" website available, and for the latter, I don't use or have any ios devices.
