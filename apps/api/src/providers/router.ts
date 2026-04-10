import { runwayProvider } from "./runway";
import { pikaProvider } from "./pika";
import { VideoProvider } from "./types";

const providers: VideoProvider[] = [
  runwayProvider,
  pikaProvider,
];

export async function generateWithProviders(prompt: string) {
  for (const provider of providers) {
    try {
      console.log(`⚡ Trying ${provider.name}...`);

      const result = await provider.generate(prompt);

      if (result.url) {
        console.log(`✅ ${provider.name} success`);
        return result.url;
      }
    } catch (err) {
      console.log(`❌ ${provider.name} failed`);
    }
  }

  throw new Error("All providers failed");
}