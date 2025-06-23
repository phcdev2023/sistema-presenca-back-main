import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { initializeFirebase } from '../config/firebase';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Attendance } from '../models/Attendance';
import { Notification } from '../models/Notification';

async function seed() {
  await connectDB();
  initializeFirebase();

  // Limpar coleções
  await User.deleteMany({});
  await Event.deleteMany({});
  await Attendance.deleteMany({});
  await Notification.deleteMany({});

  // Usuários
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123', // Em produção, deve ser hash!
    course: 'BSI',
    registration: '0001',
    role: 'admin',
    acceptedTerms: true
  });
  const professor = await User.create({
    name: 'Prof. João',
    email: 'professor@example.com',
    password: 'prof123',
    course: 'BSI',
    registration: '0002',
    role: 'professor',
    acceptedTerms: true
  });
  const aluno = await User.create({
    name: 'Aluno Maria',
    email: 'aluno@example.com',
    password: 'aluno123',
    course: 'BSI',
    registration: '0003',
    role: 'aluno',
    acceptedTerms: true
  });

  // Evento
  const evento = await Event.create({
    title: 'Aula Inaugural',
    description: 'Primeira aula do semestre',
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    location: { name: 'Sala 101', coordinates: { lat: -23.5, lng: -46.6 } },
    maxParticipants: 50,
    createdBy: professor._id,
    type: 'class',
    category: 'Disciplina',
    qrCodeData: 'qrcode123',
    attendees: [],
    waitingList: [],
  });

  // Presença
  await Attendance.create({
    eventId: evento._id,
    userId: aluno._id,
    status: 'attended',
    checkInMethod: ['qr'],
    checkInTime: new Date(),
    location: { lat: -23.5, lng: -46.6 },
    deviceInfo: { device: 'Test' },
    synced: true,
  });

  // Notificação
  await Notification.create({
    userId: aluno._id,
    title: 'Bem-vindo!',
    message: 'Sua inscrição foi realizada.',
    type: 'reminder',
    relatedTo: { type: 'event', id: evento._id },
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Seed concluído!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
