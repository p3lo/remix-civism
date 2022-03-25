export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
}

export interface Poll {
  id: number;
  created_at: Date;
  poll: string;
  poll_description: string | null;
  slug: string;
  private: boolean;
  authorId: number;
  author: User;
  options: Option[];
}

export interface Option {
  id: number;
  option: string;
  votes: number;
  pollId: number;
  poll: Poll;
}
