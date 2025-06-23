import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { initializeFirebase } from './config/firebase';
import userRouter from './routes/user.routes';
import eventRouter from './routes/event.routes';
import attendanceRouter from './routes/attendance.routes';
import notificationRouter from './routes/notification.routes';
import integrationRouter from './routes/integration.routes';
import studentRouter from './routes/student.routes';
import adminPushTokenRouter from './routes/adminPushToken.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';


class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'API is running!' });
    });

    // Documentação Swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use('/api/users', userRouter);
    this.app.use('/api/events', eventRouter);
    this.app.use('/api/attendances', attendanceRouter);
    this.app.use('/api/notifications', notificationRouter);
    this.app.use('/api/integration', integrationRouter);
    this.app.use('/api/students', studentRouter);
    this.app.use('/api/admins', adminPushTokenRouter);
  }

    public async connect(): Promise<void> {
    await connectDB();
    initializeFirebase();
  }
}

export default App;
