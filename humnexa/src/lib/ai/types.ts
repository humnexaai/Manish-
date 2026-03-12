export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIStreamOptions {
  mode?: string;
  module?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIProvider {
  name: string;
  chat(messages: AIMessage[], options?: AIStreamOptions): Promise<ReadableStream<Uint8Array>>;
  chatSync(messages: AIMessage[], options?: AIStreamOptions): Promise<string>;
}
