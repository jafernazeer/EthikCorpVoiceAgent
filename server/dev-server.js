import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 5173);

const app = express();
app.use(express.json());

const vite = await createViteServer({
  root,
  server: { middlewareMode: true, host: "0.0.0.0" },
  appType: "spa",
});

app.use(vite.middlewares);

app.listen(port, "0.0.0.0", () => {
  console.log(`EthikCorp EC Calling Agent dashboard running at http://localhost:${port}/`);
});
