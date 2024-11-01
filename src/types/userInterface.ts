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

export interface IPasswordRecovery {
  recoverId: number;
  token: string | null;
  expiry: Date | null;
  lastResetAt: Date | null;
  userId: number;
}
