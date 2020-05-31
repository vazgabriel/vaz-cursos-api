# Vaz Cursos API

API em Adonis (Node.js) para curso de Flutter

## Requirements

[Node.js V12+](https://nodejs.org/)

[NPM V6+](https://www.npmjs.com/) (Vem com Node)

[Docker Compose](https://docs.docker.com/compose/)

(Opcionalmente pode usar Yarn)

## Installation

```bash
yarn
```

OU

```bash
npm install
```

Configure o .env baseado no .env.example

```bash
cp .env.example .env
nano .env # Editar valores
```

## RUN

Database

```bash
docker-compose up
```

Development

```bash
node ace serve -w
```
