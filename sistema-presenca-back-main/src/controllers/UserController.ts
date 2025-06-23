import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.userService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error registering user' });
    }
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      // retornar login com token
      // const result = await this.userService.login(req.body);
      // return res.json(result);

      // retornar apenas o token
      const token = await this.userService.login(req.body);
      return res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid credentials' });
    }
  };

  public getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.getUserProfile(req.params.id);
      return res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(404).json({ error: error instanceof Error ? error.message : 'User not found' });
    }
  };

  public updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.updateUserProfile(req.params.id, req.body);
      return res.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating user' });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      return res.json(result);
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(404).json({ error: error instanceof Error ? error.message : 'Error deleting user' });
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(400).json({ error: 'Error fetching users' });
    }
  };

  public getUsersByType = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getUsersByType(req.params.role);
      return res.json(users);
    } catch (error) {
      console.error('Error fetching users by type:', error);
      return res.status(400).json({ error: 'Error fetching users' });
    }
  };

  public updateFcmToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      const { fcmToken } = req.body;

      if (!fcmToken) {
        return res.status(400).json({ error: 'fcmToken is required' });
      }

      const result = await this.userService.updateFcmToken(userId, fcmToken);
      return res.json(result);
    } catch (error) {
      console.error('Error updating FCM token:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error updating FCM token' });
    }
  };
}
