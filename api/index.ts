// api/index.ts
import appModule from "../backend/dist/app.js";

const app = (appModule as any).default || appModule;

export default function handler(req: any, res: any) {
  req.url = req.url.replace(/^\/api/, "") || "/";
  return app(req, res);
}