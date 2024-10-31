export type Message = {
  role: string;
  content: string;
  retrieved?: string;

  // Other info
  references?: string[];
};

export type NewChatMeta = {
  id: string;
  prompt: string;
  model: string;
};

