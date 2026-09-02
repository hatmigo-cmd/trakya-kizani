import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat";
import { errorHandler } from "./middleware/errorHandler";
import { HUMOR_LEVELS } from "./personas/buildSystemPrompt";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "trakya-kizani-server" });
});

app.get("/api/humor-levels", (_req, res) => {
  res.json({ levels: HUMOR_LEVELS });
});

app.use("/api/chat", chatRouter);

app.use(errorHandler);

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "[trakya-kizani-server] UYARI: GEMINI_API_KEY tanımlı değil. " +
      ".env.example dosyasını .env olarak kopyalayıp anahtarınızı girin, " +
      "aksi halde /api/chat istekleri hata dönecektir."
  );
}

app.listen(PORT, () => {
  console.log(`[trakya-kizani-server] http://localhost:${PORT} üzerinde çalışıyor`);
});
