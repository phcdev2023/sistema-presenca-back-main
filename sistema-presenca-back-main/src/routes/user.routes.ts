import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { firebaseAuth } from '../middleware/firebaseAuth';

const router = Router();
const userController = new UserController();


const register: RequestHandler = async (req, res) => {
  await userController.register(req, res);
};

const login: RequestHandler = async (req, res) => {
  await userController.login(req, res);
};

const getUserProfile: RequestHandler = async (req, res) => {
  await userController.getUserProfile(req, res);
};

const updateUserProfile: RequestHandler = async (req, res) => {
  await userController.updateUserProfile(req, res);
};

const getAllUsers: RequestHandler = async (req, res) => {
  await userController.getAllUsers(req, res);
};

const getUsersByType: RequestHandler = async (req, res) => {
  await userController.getUsersByType(req, res);
};

const deleteUser: RequestHandler = async (req, res) => {
  await userController.deleteUser(req, res);
};

const updateFcmToken: RequestHandler = async (req, res) => {
  await userController.updateFcmToken(req, res);
};
/**
 * @swagger
 * /api/users/auth/register:
 *   post:
 *     summary: Registro de novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               course:
 *                 type: string
 *               registration:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, professor, aluno]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/auth/register', register);

/**
 * @swagger
 * /api/users/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/auth/login', login);
router.get('/users/profile/:id', firebaseAuth, getUserProfile);
router.put('/users/profile/:id', firebaseAuth, updateUserProfile);
router.get('/users', firebaseAuth, getAllUsers);
router.get('/users/type/:role', firebaseAuth, getUsersByType);
router.delete('/users/:id', firebaseAuth, deleteUser);
router.put('/users/:userId/fcm-token', firebaseAuth, updateFcmToken);

export default router;