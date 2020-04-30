#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["HomeClimatControl.Web/HomeClimatControl.Web.csproj", "HomeClimatControl.Web/"]
RUN dotnet restore "HomeClimatControl.Web/HomeClimatControl.Web.csproj"
COPY . .
WORKDIR "/src/HomeClimatControl.Web"
RUN dotnet build "HomeClimatControl.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HomeClimatControl.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HomeClimatControl.Web.dll"]