import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";

type Environment = "dev" | "prod";

const ENV = (Deno.env.get("ENV") ?? "dev") as Environment;
const BOT_TOKEN = ENV === "dev"
  ? Deno.env.get("STAGE_BOT_TOKEN")
  : Deno.env.get("PROD_BOT_TOKEN");

if (BOT_TOKEN === undefined) {
  throw new Error("BOT_TOKEN is not provided");
}

const bot = new Bot(BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response("not allowed", { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});
