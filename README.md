# Vaz Cursos API

Adonis API (Node.js) for Flutter course app

API em Adonis (Node.js) para curso de Flutter

## [App Repository](https://github.com/vazgabriel/vaz-cursos)

## Requirements

[Node.js V12+](https://nodejs.org/)

[NPM V6+](https://www.npmjs.com/)

[Docker Compose](https://docs.docker.com/compose/)

Optionally you can use yarn (Opcionalmente pode usar Yarn)

## Installation

```bash
yarn
```

OR (OU)

```bash
npm install
```

Config your .env based on .env.example (Configure o .env baseado no .env.example)

```bash
cp .env.example .env
vi .env # Update values (Editar valores)
```

## Running

Database (PostgreSQL)

```bash
docker-compose up
```

Development

```bash
# Scripts
yarn start
# OR (OU)
npm start

# Final code
node ace serve -w
```
