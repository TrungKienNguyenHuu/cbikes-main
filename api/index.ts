import appModule from "../backend/dist/app.js";

const app = (appModule as any).default || appModule;

export default function handler(req: any, res: any) {
  // IMPORTANT: preserve original URL properly
  const originalUrl = req.url;

  // strip ONLY /api prefix
  req.url = req.url.replace(/^\/api/, "") || "/";

  // CRITICAL: also fix Express internal routing
  req.originalUrl = originalUrl.replace(/^\/api/, "") || "/";

  return app(req, res);
}