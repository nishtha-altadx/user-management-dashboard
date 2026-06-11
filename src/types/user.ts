export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
};
