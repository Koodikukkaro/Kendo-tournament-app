export interface User {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  clubName: string;
  danRank: string;
  underage?: boolean;
  guardiansEmail?: string;
}
