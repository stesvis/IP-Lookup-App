# IP Lookup App

This app was created with the command `dotnet new react -o ip-lookup-app`, which created a **React** frontend and a **.NET Core** backend.
Doing it this way allowed me to be able to ship the whole app in one build. Should you want to deploy it, it could host frontend and backend under the same domain.

## Pre Requisites

1. Install .NET 7: https://dotnet.microsoft.com/en-us/download/dotnet/7.0
   - Linux: https://learn.microsoft.com/en-us/dotnet/core/install/linux-scripted-manual#scripted-install
2. Ensure you have an environment variable called `ASPNETCORE_ENVIRONMENT` with value of `Development`.
   - Linux: `export ASPNETCORE_ENVIRONMENT=Development`

## Run the app

To run the app you have to build it first and then run it:

1. Go to the app root folder: `cd ip-lookup-app`
2. `dotnet build`
3. `dotnet run`

It will print something like this in the terminal:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7016 <<<---------- open this for https
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5276 <<<---------- open this for http
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: R:\Demos\1\ip-lookup-app
```

4. Open one of the two urls in your browser (you may have to allow the "not secure connection")

Wait until the frontend is loaded. A proxy will automatically connect it to the backend.

### Notes

There is a port number `44486` hardcoded for development environment. If you need to use a different one just search and replace every instance.

## Run Unit Tests

I added some basic backend unit tests just for demo.

- Go to the Tests folder: `cd Tests`
- `dotnet test`

## Publish the app

From the app root folder `ip-lookup-app` run this command:

- `dotnet publish -c Release`

This will build the backend and also the frontend (i.e. running the `react-scripts` commands).

If successful you should see something like this:

```
  The project was built assuming it is hosted at /.
  You can control this with the homepage field in your package.json.

  The build folder is ready to be deployed.
  You may serve it with a static server:

    serve -s build

  Find out more about deployment here:

    https://cra.link/deployment

  ip-lookup-app -> R:\Demos\1\ip-lookup-app\bin\Release\net7.0\publish\
```

Full documentation: https://learn.microsoft.com/en-us/dotnet/core/deploying/deploy-with-cli
