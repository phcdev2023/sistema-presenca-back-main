import { Router, Request, Response, NextFunction } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();
const notificationController = new NotificationController();

// Rotas existentes
/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Cria uma nova notificação
 *     tags: [Notificações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notificação criada
 */
router.post('/notifications', async (req: Request, res: Response) => {
  await notificationController.create(req, res);
});

/**
 * @swagger
 * /api/notifications/user/{userId}:
 *   get:
 *     summary: Lista notificações de um usuário
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get('/notifications/user/:userId', async (req: Request, res: Response) => {
  await notificationController.getUserNotifications(req, res);
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Marca uma notificação como lida
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 */
router.patch('/notifications/:id/read', async (req: Request, res: Response) => {
  await notificationController.markAsRead(req, res);
});

/**
 * @swagger
 * /api/notifications/user/{userId}/read-all:
 *   patch:
 *     summary: Marca todas as notificações do usuário como lidas
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificações marcadas como lidas
 */
router.patch('/notifications/user/:userId/read-all', async (req: Request, res: Response) => {
  await notificationController.markAllAsRead(req, res);
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Remove uma notificação
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação removida
 */
router.delete('/notifications/:id', async (req: Request, res: Response) => {
  await notificationController.delete(req, res);
});

// Novas rotas
router.post('/notifications/event/:eventId/remind', async (req: Request, res: Response) => {
  await notificationController.sendEventReminder(req, res);
});

router.post('/notifications/attendance/confirm', async (req: Request, res: Response) => {
  await notificationController.sendAttendanceConfirmation(req, res);
});

// Atualização de evento
router.post('/notifications/event/:eventId/update', 
  authenticateToken,
  [
    body('userId').isMongoId().withMessage('ID do usuário inválido'),
    body('message').notEmpty().withMessage('A mensagem é obrigatória'),
    body('type').optional().isIn(['reminder', 'update', 'alert']).withMessage('Tipo de notificação inválido')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    await notificationController.sendUpdateNotification(req, res).catch(next);
  }
);

// Notificação em massa
router.post('/notifications/bulk',
  authenticateToken,
  [
    body('userIds')
      .isArray({ min: 1 })
      .withMessage('A lista de usuários é obrigatória')
      .custom((value: any[]) => value.every(id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)))
      .withMessage('IDs de usuário inválidos'),
    body('title').notEmpty().withMessage('O título é obrigatório'),
    body('message').notEmpty().withMessage('A mensagem é obrigatória'),
    body('relatedTo').optional().isObject().withMessage('O objeto relacionado deve ser um objeto')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    await notificationController.sendBulkNotification(req, res).catch(next);
  }
);

// Estatísticas de notificações
router.get('/notifications/stats/:userId',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    await notificationController.getStats(req, res).catch(next);
  }
);

export default router;