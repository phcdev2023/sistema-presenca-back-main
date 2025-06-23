# Documentação da API

## Autenticação e Gerenciamento de Usuários

### Registrar Usuário
- **POST** `/auth/register`
- Cria uma nova conta de usuário
- **Body**: Dados de registro do usuário

### Login
- **POST** `/auth/login`
- Autentica um usuário e retorna um token
- **Body**: Email e senha

### Perfil do Usuário
- **GET** `/users/profile/:id`
- Obtém o perfil do usuário por ID
- **Params**: `id` - ID do usuário

### Atualizar Perfil
- **PUT** `/users/profile/:id`
- Atualiza informações do perfil do usuário
- **Params**: `id` - ID do usuário
- **Body**: Informações atualizadas do usuário

### Listar Todos os Usuários
- **GET** `/users`
- Obtém todos os usuários do sistema

### Obter Usuários por Tipo
- **GET** `/users/type/:role`
- Obtém usuários filtrados por função
- **Params**: `role` - Tipo de função do usuário

## Eventos

### Criar Evento
- **POST** `/events`
- Cria um novo evento
- **Body**: Detalhes do evento

### Atualizar Evento
- **PUT** `/events/:id`
- Atualiza um evento existente
- **Params**: `id` - ID do evento
- **Body**: Informações atualizadas do evento

### Excluir Evento
- **DELETE** `/events/:id`
- Exclui um evento
- **Params**: `id` - ID do evento

### Obter Evento
- **GET** `/events/:id`
- Obtém detalhes do evento por ID
- **Params**: `id` - ID do evento

### Listar Todos os Eventos
- **GET** `/events`
- Obtém todos os eventos

### Obter Eventos por Criador
- **GET** `/events/creator/:creatorId`
- Obtém todos os eventos criados por um usuário específico
- **Params**: `creatorId` - ID do criador

### Registrar em Evento
- **POST** `/events/:id/register`
- Registra um usuário em um evento
- **Params**: `id` - ID do evento

### Gerar QR Code
- **GET** `/events/:id/qrcode`
- Gera QR code para presença no evento
- **Params**: `id` - ID do evento

### Obter Participantes do Evento
- **GET** `/events/:id/attendees`
- Obtém lista de participantes de um evento
- **Params**: `id` - ID do evento

## Presença

### Marcar Presença
- **POST** `/attendance/mark`
- Marca presença em um evento
- **Body**:
  ```json
  {
    "eventId": "string",
    "userId": "string",
    "status": "string",
    "checkInMethod": ["qr", "manual"],
    "location": {
      "lat": "number",
      "lng": "number"
    },
    "deviceInfo": "object",
    "notes": "string (opcional)"
  }
  ```

### Verificar Presença
- **POST** `/attendance/verify`
- Verifica registro de presença
- **Body**: Detalhes da verificação

### Sincronizar Presença
- **POST** `/attendance/sync/:eventId`
- Sincroniza registros de presença para um evento
- **Params**: `eventId` - ID do evento

### Obter Presenças do Evento
- **GET** `/attendance/event/:eventId`
- Obtém todos os registros de presença de um evento
- **Params**: `eventId` - ID do evento
- **Query**:
  - `includeNotes` - (opcional) Incluir notas de presença
  - `status` - (opcional) Filtrar por status de presença

### Obter Presenças do Usuário
- **GET** `/attendance/user/:userId`
- Obtém histórico de presenças de um usuário
- **Params**: `userId` - ID do usuário

### Gerar Relatório de Presença
- **GET** `/attendance/report/:eventId`
- Gera relatório de presença para um evento
- **Params**: `eventId` - ID do evento
- **Query**:
  - `format` - Formato do relatório (pdf, csv, excel)
  - `includeNotes` - (opcional) Incluir notas no relatório
  - `startDate` - (opcional) Data inicial para filtro
  - `endDate` - (opcional) Data final para filtro

## Relatórios

### Gerar Relatório de Evento
- **GET** `/reports/event/:eventId`
- Gera relatório detalhado de um evento
- **Params**: `eventId` - ID do evento
- **Query**:
  - `format` - Formato do relatório (pdf, csv, excel)
  - `includeNotes` - (opcional) Incluir notas

### Gerar Relatório de Usuário
- **GET** `/reports/user/:userId`
- Gera relatório de presenças de um usuário
- **Params**: `userId` - ID do usuário
- **Query**:
  - `format` - Formato do relatório (pdf, csv, excel)
  - `startDate` - (opcional) Data inicial
  - `endDate` - (opcional) Data final
  - `includeNotes` - (opcional) Incluir notas

## Notificações

### Criar Notificação
- **POST** `/notifications`
- Cria uma nova notificação
- **Body**: Detalhes da notificação

### Obter Notificações do Usuário
- **GET** `/notifications/user/:userId`
- Obtém todas as notificações de um usuário
- **Params**: `userId` - ID do usuário

### Marcar Notificação como Lida
- **PATCH** `/notifications/:id/read`
- Marca uma notificação específica como lida
- **Params**: `id` - ID da notificação

### Marcar Todas as Notificações como Lidas
- **PATCH** `/notifications/user/:userId/read-all`
- Marca todas as notificações como lidas para um usuário
- **Params**: `userId` - ID do usuário

### Excluir Notificação
- **DELETE** `/notifications/:id`
- Exclui uma notificação
- **Params**: `id` - ID da notificação

### Enviar Lembrete de Evento
- **POST** `/notifications/event/:eventId/remind`
- Envia notificações de lembrete para um evento
- **Params**: `eventId` - ID do evento
- **Body**:
  ```json
  {
    "message": "string (opcional)",
    "scheduleTime": "Date (opcional)"
  }
  ```

### Enviar Confirmação de Presença
- **POST** `/notifications/attendance/confirm`
- Envia notificação de confirmação de presença
- **Body**:
  ```json
  {
    "userId": "string",
    "eventId": "string",
    "message": "string (opcional)"
  }
  ```

### Enviar Notificação de Atualização de Evento
- **POST** `/notifications/event/:eventId/update`
- Envia notificação sobre atualizações do evento
- **Params**: `eventId` - ID do evento
- **Body**:
  ```json
  {
    "message": "string",
    "notifyAll": "boolean (opcional)",
    "type": "string (opcional) - update, alert, reminder"
  }
  ```
