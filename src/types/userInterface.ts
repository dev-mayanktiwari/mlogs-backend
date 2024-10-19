export interface IUserInterface {
  name: string;
  email: string;
  username: string;
  password: string;
  accountConfirmation: {
    token: string;
    code: string;
    isVerified: boolean;
    timestamp: Date | null;
  };
}
