import { Router, RequestHandler } from 'express';
import { EventController } from '../controllers/EventController';

const router = Router();
const eventController = new EventController();

const createEvent: RequestHandler = async (req, res) => {
  await eventController.createEvent(req, res);
};

const updateEvent: RequestHandler = async (req, res) => {
  await eventController.updateEvent(req, res);
};

const deleteEvent: RequestHandler = async (req, res) => {
  await eventController.deleteEvent(req, res);
};

const getEventById: RequestHandler = async (req, res) => {
  await eventController.getEventById(req, res);
};

const getAllEvents: RequestHandler = async (req, res) => {
  await eventController.getAllEvents(req, res);
};

const getEventsByCreator: RequestHandler = async (req, res) => {
  await eventController.getEventsByCreator(req, res);
};

const registerForEvent: RequestHandler = async (req, res) => {
  await eventController.registerForEvent(req, res);
};

const generateQRCode: RequestHandler = async (req, res) => {
  await eventController.generateQRCode(req, res);
};

const getAttendees: RequestHandler = async (req, res) => {
  await eventController.getAttendees(req, res);
};

// Agora as rotas não incluem /events, pois o prefixo virá do server.ts
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/events', createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
router.put('/events/:id', updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Remove um evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento removido
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/events/:id', deleteEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Busca evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/events/:id', getEventById);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/events', getAllEvents);

/**
 * @swagger
 * /api/events/creator/{creatorId}:
 *   get:
 *     summary: Lista eventos por criador
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: creatorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de eventos do criador
 */
router.get('/events/creator/:creatorId', getEventsByCreator);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Registrar usuário em evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro realizado
 *       400:
 *         description: Falha no registro
 */
router.post('/events/:id/register', registerForEvent);

/**
 * @swagger
 * /api/events/{id}/qrcode:
 *   get:
 *     summary: Gera QR Code do evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR Code gerado
 */
router.get('/events/:id/qrcode', generateQRCode);

/**
 * @swagger
 * /api/events/{id}/attendees:
 *   get:
 *     summary: Lista de participantes do evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de participantes
 */
router.get('/events/:id/attendees', getAttendees);

export default router;

