import express from 'express';
import AdminPushToken from '../models/AdminPushToken';

const router = express.Router();

// Registrar/atualizar token do admin
router.post('/register-token', async (req, res) => {
  const { token, adminId } = req.body;
  if (!token) return res.status(400).json({ message: 'Token é obrigatório.' });
  try {
    let doc = await AdminPushToken.findOneAndUpdate(
      { token },
      { token, adminId },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar token.' });
  }
});

export default router;
