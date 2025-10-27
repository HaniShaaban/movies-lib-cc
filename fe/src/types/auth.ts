export interface User {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  assignAdmin: (userId: string) => Promise<void>;
}