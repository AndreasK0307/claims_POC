import { PrismaClient } from "../../generated/client/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { DATABASE_URL } = config();

const PrismaService = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

export default PrismaService;
