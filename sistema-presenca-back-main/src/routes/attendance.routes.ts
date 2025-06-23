import { Router, Request, Response } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';

const router = Router();
const attendanceController = new AttendanceController();

// Routes
/**
 * @swagger
 * /api/attendance/mark:
 *   post:
 *     summary: Marca presença em um evento
 *     tags: [Presenças]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presença marcada
 *       400:
 *         description: Dados inválidos
 */
router.post('/attendance/mark', async (req: Request, res: Response) => {
  await attendanceController.markAttendance(req, res);
});

/**
 * @swagger
 * /api/attendance/verify:
 *   post:
 *     summary: Verifica presença de um usuário em um evento
 *     tags: [Presenças]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presença confirmada
 *       404:
 *         description: Presença não encontrada
 */
router.post('/attendance/verify', async (req: Request, res: Response) => {
  await attendanceController.verifyAttendance(req, res);
});

/**
 * @swagger
 * /api/attendance/sync/{eventId}:
 *   post:
 *     summary: Sincroniza presenças de um evento
 *     tags: [Presenças]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Presenças sincronizadas
 */
router.post('/attendance/sync/:eventId', async (req: Request, res: Response) => {
  await attendanceController.syncAttendance(req, res);
});

/**
 * @swagger
 * /api/attendance/event/{eventId}:
 *   get:
 *     summary: Lista presenças de um evento
 *     tags: [Presenças]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de presenças
 */
router.get('/attendance/event/:eventId', async (req: Request, res: Response) => {
  await attendanceController.getEventAttendance(req, res);
});

/**
 * @swagger
 * /api/attendance/user/{userId}:
 *   get:
 *     summary: Lista presenças de um usuário
 *     tags: [Presenças]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de presenças do usuário
 */
router.get('/attendance/user/:userId', async (req: Request, res: Response) => {
  await attendanceController.getUserAttendance(req, res);
});

/**
 * @swagger
 * /api/attendance/report/{eventId}:
 *   get:
 *     summary: Gera relatório de presenças de um evento
 *     tags: [Presenças]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório gerado
 */
router.get('/attendance/report/:eventId', async (req: Request, res: Response) => {
  await attendanceController.generateReport(req, res);
});

export default router;