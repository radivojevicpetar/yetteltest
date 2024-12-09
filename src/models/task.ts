export interface Task {
    id: number;
    userId: number;
    body: string;
    createdAt: string; // Assuming MySQL uses DATETIME
  }
  