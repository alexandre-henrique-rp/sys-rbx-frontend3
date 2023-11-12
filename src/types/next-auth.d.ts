import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
      pemission: string;
      primeiro_acesso: boolean;
      trello_id: string;
    }
  }
}