const path = require("path");
const express = require("express");
const { Pool } = require("pg");
const { clerkMiddleware, getAuth } = require("@clerk/express");
const { publishableKeyFromHost } = require("@clerk/shared/keys");
const {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} = require("./middlewares/clerkProxyMiddleware");

const app = express();
const port = Number(process.env.PORT || 5000);
const root = path.resolve(__dirname, "..");
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

app.set("trust proxy", true);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(express.json({ limit: "16kb" }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) || "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.get("/auth-config.js", (_req, res) => {
  res
    .type("application/javascript")
    .send(
      `window.CHIMSE_CLERK_KEY=${JSON.stringify(process.env.CLERK_PUBLISHABLE_KEY || "")};`,
    );
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: Boolean(pool) });
});

function requireAuth(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Đăng nhập để chơi online" });
  req.userId = userId;
  next();
}

async function topScores() {
  const result = await pool.query(`
    SELECT name, score, user_id
    FROM (
      SELECT DISTINCT ON (clerk_user_id)
        player_name AS name,
        score,
        clerk_user_id AS user_id,
        created_at
      FROM scores
      ORDER BY clerk_user_id, score DESC, created_at ASC
    ) best_scores
    ORDER BY score DESC, created_at ASC
    LIMIT 100
  `);
  return result.rows;
}

app.get("/api/scores", async (_req, res) => {
  if (!pool) return res.status(503).json({ error: "Database chưa sẵn sàng" });
  try {
    res.json({ scores: await topScores() });
  } catch (error) {
    console.error("Loading scores failed:", error);
    res.status(503).json({ error: "Không tải được bảng xếp hạng" });
  }
});

app.post("/api/scores", requireAuth, async (req, res) => {
  if (!pool) return res.status(503).json({ error: "Database chưa sẵn sàng" });

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const score = Number(req.body?.score);
  if (!name || name.length > 10 || !Number.isInteger(score) || score < 0 || score > 1000000) {
    return res.status(400).json({ error: "Tên hoặc điểm không hợp lệ" });
  }

  try {
    const previous = await pool.query(
      "SELECT COALESCE(MAX(score), 0) AS score FROM scores WHERE clerk_user_id = $1",
      [req.userId],
    );
    if (score > Number(previous.rows[0].score)) {
      await pool.query(
        "INSERT INTO scores (clerk_user_id, player_name, score) VALUES ($1, $2, $3)",
        [req.userId, name, score],
      );
    }
    res.json({ scores: await topScores() });
  } catch (error) {
    console.error("Saving score failed:", error);
    res.status(503).json({ error: "Không lưu được điểm" });
  }
});

app.get("/", (_req, res) => res.sendFile(path.join(root, "index.html")));
app.get("/index.html", (_req, res) => res.sendFile(path.join(root, "index.html")));

app.listen(port, "0.0.0.0", () => {
  console.log(`Chim Sẻ server listening on port ${port}`);
});