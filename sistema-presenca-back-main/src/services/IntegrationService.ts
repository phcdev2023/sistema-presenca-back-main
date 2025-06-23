import { Types } from 'mongoose';
import { google } from 'googleapis';
import { User } from '../models/User';
import { Event } from '../models/Event';
import axios from 'axios';

interface EventData {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
}


export class IntegrationService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Define as credenciais do OAuth2 Client a partir do usuário
   */
  private setOAuth2Credentials(user: any) {
    this.oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });
  }

  /**
   * Valida os dados obrigatórios do evento
   */
  private validateEventData(eventData: EventData) {
    if (!eventData.summary || !eventData.startDateTime || !eventData.endDateTime) {
      throw new Error('Dados obrigatórios do evento ausentes.');
    }
  }

  public getGoogleAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  /**
   * Realiza o callback do Google OAuth2 e salva os tokens no usuário.
   */
  public async handleGoogleCallback(code: string, userId: Types.ObjectId) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      await User.findByIdAndUpdate(userId, {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
      });
      return { message: 'Google authentication successful.' };
    } catch (error) {
      console.error('Erro ao processar callback do Google OAuth2:', error);
      throw new Error('Falha na autenticação com o Google.');
    }
  }

  /**
   * Sincroniza eventos do sistema com o Moodle via REST API
   */
  public async syncEventsWithMoodle(userId: Types.ObjectId) {
    const events = await Event.find({ createdBy: userId });
    const moodleUrl = process.env.MOODLE_API_URL;
    const moodleToken = process.env.MOODLE_API_TOKEN;
    if (!moodleUrl || !moodleToken) throw new Error('Moodle API URL ou Token não configurados');
    const payload = {
      token: moodleToken,
      function: 'core_event_create_events',
      events: events.map(e => ({
        name: e.title,
        description: e.description,
        timestart: Math.floor(new Date(e.startDate).getTime() / 1000),
        timeend: Math.floor(new Date(e.endDate).getTime() / 1000),
        location: e.location?.name || '',
      }))
    };
    try {
      const response = await axios.post(moodleUrl, payload);
      if (response.status !== 200) {
        console.error('Erro ao sincronizar eventos com o Moodle:', response.data);
        throw new Error('Falha ao sincronizar eventos com o Moodle.');
      }
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error('Erro na integração com o Moodle:', error?.response?.data || error);
      throw new Error('Erro de integração com o Moodle.');
    }
  }

  /**
   * Cria um evento no Google Calendar autenticado do usuário.
   */
  public async syncEventsWithGoogleCalendar(userId: Types.ObjectId, eventData: EventData) {
    const user = await User.findById(userId);
    if (!user || !user.googleAccessToken) {
      throw new Error('Usuário não autenticado com o Google.');
    }
    this.validateEventData(eventData);
    this.setOAuth2Credentials(user);
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    const event = {
      summary: eventData.summary,
      description: eventData.description || '',
      location: eventData.location || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: 'America/Sao_Paulo',
      },
    };
    try {
      const createdEvent = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return createdEvent.data;
    } catch (error: any) {
      console.error('Erro ao criar evento no Google Calendar:', error?.response?.data || error);
      throw new Error('Falha ao criar evento no Google Calendar.');
    }
  }

  // Métodos a implementar conforme necessidade do projeto
  /**
   * Sincroniza os eventos do sistema com o Moodle (stub)
   */
  public async syncEventsWithMoodleStub(userId: Types.ObjectId) {
    console.log(`Iniciando sincronização de eventos com Moodle para o usuário ${userId}`);
    return { message: 'Moodle event sync started (not implemented yet).' };
  }

  /**
   * Envia os dados de presença de um evento para o Moodle (stub)
   */
  public async syncAttendanceWithMoodle(eventId: Types.ObjectId) {
    console.log(`Iniciando sincronização de presença com Moodle para o evento ${eventId}`);
    return { message: 'Moodle attendance sync started (not implemented yet).' };
  }
}

