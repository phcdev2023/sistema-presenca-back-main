import { Router, RequestHandler } from 'express';
import { IntegrationController } from '../controllers/IntegrationController';

const router = Router();
const integrationController = new IntegrationController();

import { authenticateToken } from '../middleware/auth';

const syncGoogleCalendar: RequestHandler = async (req, res) => {
  await integrationController.syncGoogleCalendar(req, res);
};

const getGoogleAuthUrl: RequestHandler = (req, res) => {
  integrationController.getGoogleAuthUrl(req, res);
};

const handleGoogleCallback: RequestHandler = async (req, res) => {
  await integrationController.handleGoogleCallback(req, res);
};

const syncMoodleEvents: RequestHandler = async (req, res) => {
  await integrationController.syncMoodleEvents(req, res);
};

const syncMoodleAttendance: RequestHandler = async (req, res) => {
  await integrationController.syncMoodleAttendance(req, res);
};

/**
 * @swagger
 * /api/integration/google/auth:
 *   get:
 *     summary: Redireciona para autenticação Google OAuth2
 *     tags: [Integração]
 *     responses:
 *       302:
 *         description: Redirecionamento para Google
 */
router.get('/google/auth', authenticateToken, getGoogleAuthUrl);

/**
 * @swagger
 * /api/integration/google/callback:
 *   get:
 *     summary: Callback de autenticação Google
 *     tags: [Integração]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Autenticado com sucesso
 *       400:
 *         description: Código ausente
 */
router.get('/google/callback', authenticateToken, handleGoogleCallback);

/**
 * @swagger
 * /api/integration/sync/google-calendar:
 *   post:
 *     summary: Sincroniza evento com Google Calendar
 *     tags: [Integração]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventData:
 *                 type: object
 *                 description: Dados do evento a ser criado no Google Calendar
 *     responses:
 *       201:
 *         description: Evento sincronizado
 *       400:
 *         description: Dados inválidos
 */
router.post('/sync/google-calendar', authenticateToken, syncGoogleCalendar);

/**
 * @swagger
 * /api/integration/sync/moodle/events:
 *   post:
 *     summary: Sincroniza eventos com Moodle
 *     tags: [Integração]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     responses:
 *       200:
 *         description: Eventos sincronizados com Moodle
 */
router.post('/sync/moodle/events', authenticateToken, syncMoodleEvents);

/**
 * @swagger
 * /api/integration/sync/moodle/attendance:
 *   post:
 *     summary: Sincroniza presenças com Moodle
 *     tags: [Integração]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: ID do evento a ser sincronizado com o Moodle
 *     responses:
 *       200:
 *         description: Presenças sincronizadas com Moodle
 */
router.post('/sync/moodle/attendance', authenticateToken, syncMoodleAttendance);

export default router;
