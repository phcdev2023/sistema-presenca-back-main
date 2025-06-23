import { Request, Response } from 'express';
import { IntegrationService } from '../services/IntegrationService';

export class IntegrationController {
  private integrationService: IntegrationService;

  constructor() {
    this.integrationService = new IntegrationService();
  }

  public getGoogleAuthUrl = (req: Request, res: Response) => {
    try {
      const url = this.integrationService.getGoogleAuthUrl();
      res.redirect(url);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate Google Auth URL' });
    }
  };

  public handleGoogleCallback = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
      }
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      await this.integrationService.handleGoogleCallback(code as string, req.user._id);
      return res.json({ message: 'Successfully authenticated with Google!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to handle Google callback' });
    }
  };

  public syncGoogleCalendar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventData } = req.body;
      if (!eventData) {
        return res.status(400).json({ error: 'eventData is required' });
      }
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const result = await this.integrationService.syncEventsWithGoogleCalendar(req.user._id, eventData);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to sync with Google Calendar' });
    }
  };

  public syncMoodleEvents = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const result = await this.integrationService.syncEventsWithMoodle(req.user._id);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to sync events with Moodle' });
    }
  };

  public syncMoodleAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId } = req.body;
      // Aqui, o eventId ainda é necessário no corpo, pois depende do evento a ser sincronizado
      const result = await this.integrationService.syncAttendanceWithMoodle(eventId);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to sync attendance with Moodle' });
    }
  };
}
