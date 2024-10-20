export interface IUserInterface {
  name: string;
  username: string;
  email: string;
  password: string;
  accountConfirmation: {
    token: string;
    code: string;
    isVerified: boolean;
    timestamp: Date | null;
  };
}
