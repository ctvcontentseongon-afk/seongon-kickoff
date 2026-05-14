import { NextResponse } from "next/server";
import { getProjectHistory } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const { allowed } = rateLimit(`history:${getClientIp(req)}`, 30);
  if (!allowed) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu" }, { status: 429 });
  }

  const history = await getProjectHistory(10);
  return NextResponse.json({ history });
}
