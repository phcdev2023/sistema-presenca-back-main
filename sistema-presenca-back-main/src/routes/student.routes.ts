import { Router, Request, Response } from 'express';
import { Student } from '../models/Student';
import AdminPushToken from '../models/AdminPushToken';
import { sendExpoPushNotification } from '../utils/sendExpoPushNotification';

const router = Router();

// List all students
router.get('/students', async (_req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Create a new student
router.post('/students', async (req: Request, res: Response) => {
  try {
    const { name, email, registration } = req.body;
    const student = new Student({ name, email, registration });
    await student.save();

    // Notificação push para admins
    try {
      const tokensDocs = await AdminPushToken.find();
      const tokens = tokensDocs.map(doc => doc.token);
      if (tokens.length > 0) {
        await sendExpoPushNotification(tokens, 'Novo aluno cadastrado', `Aluno ${name} foi cadastrado.`);
      }
    } catch (notifyErr) {
      console.error('Erro ao enviar push notification para admins:', notifyErr);
    }

    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Erro ao cadastrar aluno' });
  }
});

// Update a student
router.put('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, registration } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, registration },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar aluno' });
  }
});

// Delete a student
router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover aluno' });
  }
});

export default router;
