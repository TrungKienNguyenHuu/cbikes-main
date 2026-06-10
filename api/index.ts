import appModule from "../backend/dist/app.js";

const app = (appModule as any).default || appModule;

export default function handler(req: any, res: any) {
  console.log("typeof app:", typeof app);

  if (typeof app !== "function") {
    return res.status(500).json({
      error: "App is not a function",
      type: typeof app,
      keys: Object.keys(app || {})
    });
  }

  return app(req, res);
}