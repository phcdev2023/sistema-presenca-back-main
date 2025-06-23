export interface IUser extends Document {
  anonymized?: boolean;
  _id: any;
  name: string;
  email: string;
  password: string;
  course: string;
  registration: string;
  role: string;
  fcmToken?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  course: string;
  registration?: string;
  role: string;
  fcmToken?: string;
  acceptedTerms: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  course?: string;
  registration?: string;
  role?: string;
  fcmToken?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
}

export interface UpdateFcmTokenDTO {
  fcmToken: string;
}
