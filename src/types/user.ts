export interface User {
  id: number;

  name: string;

  username: string;

  email: string;

  phone: string;

  website: string;

  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };

  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
};
