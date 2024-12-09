export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: 'basic' | 'admin';
  }
  
  export interface UserUpdate {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: 'basic' | 'admin';
  }