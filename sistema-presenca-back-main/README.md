# Dev Web II - API REST

API REST desenvolvida com Express.js e TypeScript para a disciplina de Desenvolvimento Web II.

## Tecnologias

- Node.js
- TypeScript
- Express.js
- CORS

## Requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

```bash
# Instalar dependências
npm install
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build`: Compila o projeto TypeScript
- `npm start`: Inicia o servidor usando o código compilado
- `npm test`: Executa os testes (quando implementados)

## Estrutura do Projeto

```
src/
  ├── server.ts     # Arquivo principal do servidor
dist/               # Código compilado
```

## Configuração

O servidor está configurado para rodar na porta 3000 por padrão. A aplicação usa TypeScript com as seguintes configurações principais:

- Target: ES2017
- Module: CommonJS
- Strict Mode habilitado
- Suporte a decorators
- Compilação para pasta ./dist

## Endpoints

- `GET /`: Retorna uma mensagem de status da API

## Como Desenvolver

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor em modo desenvolvimento: `npm run dev`
4. O servidor estará rodando em `http://localhost:3000`

## Build e Produção

Para preparar o código para produção:

1. Execute `npm run build` para compilar o TypeScript
2. Os arquivos compilados estarão na pasta `dist/`
3. Execute `npm start` para rodar a versão de produção

## Licença

ISC
