# Thunder Client Collections

Este diretório contém as coleções do Thunder Client para testar a API de Eventos e Presenças.

## Como usar

1. Instale a extensão Thunder Client no VS Code
2. Importe as coleções (arquivos .json) no Thunder Client
3. Configure as variáveis de ambiente no Thunder Client:
   - `userId`: ID de um usuário existente
   - `eventId`: ID de um evento existente

## Coleções

### User API (user.json)
- Create User (POST)
- Get All Users (GET)
- Get User by ID (GET)

### Event API (event.json)
- Create Event (POST)
- Get All Events (GET)
- Get Event by ID (GET)
- Update Event (PUT)
- Delete Event (DELETE)
- Register for Event (POST)
- Update Attendee Status (PUT)

### Attendance API (attendance.json)
- Check-in (POST)
- Get Event Attendance (GET)
- Get User Attendance (GET)
- Sync Offline Attendance (POST)

## Fluxo de Teste Típico

1. Crie um usuário (User API > Create User)
2. Crie um evento (Event API > Create Event)
3. Registre o usuário no evento (Event API > Register for Event)
4. Faça check-in do usuário no evento (Attendance API > Check-in)
5. Verifique a presença (Attendance API > Get Event Attendance)
