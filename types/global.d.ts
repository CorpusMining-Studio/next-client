export type Message = {
  id: number;
  role: string;
  text: string;
  retrieved?: string;

  // Other info
  references?: string[];
};

export type NewChatMeta = {
  id: string;
  prompt: string;
  model: string;
};
