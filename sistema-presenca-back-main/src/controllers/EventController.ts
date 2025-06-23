import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { EventService } from '../services/EventService';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public createEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await this.eventService.createEvent({
        ...req.body,
        createdBy: Types.ObjectId.createFromHexString(req.body.createdBy)
      });
      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error creating event' });
    }
  };

  public updateEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await this.eventService.updateEvent(req.params.id, req.body);
      return res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating event' });
    }
  };

  public deleteEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.eventService.deleteEvent(req.params.id);
      return res.json(result);
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error deleting event' });
    }
  };

  public getEventById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      return res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(404).json({ error: error instanceof Error ? error.message : 'Event not found' });
    }
  };

  public getAllEvents = async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await this.eventService.getAllEvents();
      return res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(400).json({ error: 'Error fetching events' });
    }
  };

  public getEventsByCreator = async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await this.eventService.getEventsByCreator(req.params.creatorId);
      return res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(400).json({ error: 'Error fetching events' });
    }
  };

  public registerForEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await this.eventService.registerForEvent({
        userId: Types.ObjectId.createFromHexString(req.body.userId),
        eventId: Types.ObjectId.createFromHexString(req.params.id)
      });
      return res.json(event);
    } catch (error) {
      console.error('Error registering for event:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error registering for event' });
    }
  };

  public generateQRCode = async (req: Request, res: Response): Promise<Response> => {
    try {
      const qrCode = await this.eventService.generateQRCode(req.params.id);
      return res.json(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error generating QR code' });
    }
  };

  public getAttendees = async (req: Request, res: Response): Promise<Response> => {
    try {
      const attendees = await this.eventService.getAttendees(req.params.id);
      return res.json(attendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error fetching attendees' });
    }
  };
}
