export type GenerateVideoResult = {
  url: string | null;
};

export interface VideoProvider {
  name: string;
  generate(prompt: string): Promise<GenerateVideoResult>;
}