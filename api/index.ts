import appModule from "../backend/dist/app.js";

export default function handler(req: any, res: any) {
  res.json({
    type: typeof appModule,
    keys: Object.keys(appModule),
    defaultType: typeof (appModule as any).default
  });
}