import { Router } from 'express';
import { fcmController } from '../controllers/FcmController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Rotas de gerenciamento de tokens FCM
router.put(
  '/users/:userId/fcm-token',
  authenticateToken,
  [
    body('fcmToken')
      .notEmpty()
      .withMessage('O token FCM é obrigatório')
      .isString()
      .withMessage('O token FCM deve ser uma string')
  ],
  validateRequest,
  fcmController.updateFcmToken
);

router.delete(
  '/users/:userId/fcm-token',
  authenticateToken,
  fcmController.removeFcmToken
);

// Rota administrativa para limpar tokens inválidos
router.post(
  '/admin/fcm/cleanup',
  authenticateToken,
  authorizeRoles(['admin', 'superadmin']),
  fcmController.cleanupInvalidTokens
);

export default router;
