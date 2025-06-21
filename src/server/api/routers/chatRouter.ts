import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { OpenRouterResponse } from "@/utils/types";

export const chatRouter = createTRPCRouter({
  ask: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // ✅ Check for API key
      const apiKey = process.env.OPENROUTER_API_KEY;
      const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-3.5-turbo";

      if (!apiKey) {
        console.error("❌ OPENROUTER_API_KEY is missing from environment.");
        throw new Error("API key is not defined. Check your .env.local file.");
      }

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content: "You are a helpful fitness assistant.",
                },
                {
                  role: "user",
                  content: input.message,
                },
              ],
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ OpenRouter returned an error:", errorText);
          throw new Error(
            `OpenRouter API error: ${response.status} ${response.statusText}`,
          );
        }

        const data = (await response.json()) as OpenRouterResponse;

        const reply =
          data.choices?.[0]?.message?.content ??
          "⚠️ No response received from AI.";

        return { text: reply } satisfies { text: string };
      } catch (err) {
        console.error("❌ OpenRouter chat error:", err);
        throw new Error("OpenRouter failed to generate a response.");
      }
    }),
});
