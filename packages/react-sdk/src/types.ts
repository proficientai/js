export type Message = {
  id: string;
  createdAt: Date;
  fromAgent?: boolean;
  content: string;
};
