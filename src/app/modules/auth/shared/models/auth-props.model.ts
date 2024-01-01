import { LogInDetails } from './auth-details.model';

export interface LogInProps {
  logInDetails: LogInDetails;
}

export interface LogInSuccessProps {
  access_token: string;
  user:User;
}

interface User{
  id:number;
  username: string;
  email:string;
}
export interface RequestResetPasswordProps {
  email: string;
}

export interface ResetPasswordProps {
  accessToken: string;
  password: string;
}

export interface ResetPasswordSuccessProps {
  accessToken: string;
}
