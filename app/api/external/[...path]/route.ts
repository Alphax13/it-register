import { type NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_URL =
  process.env.EDUTRACK_API_URL ?? "https://itpsru-edutrack.vercel.app";
const EXTERNAL_API_KEY =
  process.env.EDUTRACK_API_KEY ?? "edutrack-ext-api-2026";

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>
): Promise<NextResponse> {
  const { path } = await params;
  const pathname = `/api/external/${path.join("/")}`;

  const url = new URL(pathname, EXTERNAL_API_URL);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": EXTERNAL_API_KEY,
  };

  const authHeader = request.headers.get("Authorization");
  if (authHeader) headers["Authorization"] = authHeader;

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = JSON.stringify(await request.json());
    } catch {
      body = undefined;
    }
  }

  const upstream = await fetch(url.toString(), {
    method: request.method,
    headers,
    body,
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}

export const GET = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  proxyRequest(req, ctx.params);

export const POST = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  proxyRequest(req, ctx.params);

export const PATCH = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  proxyRequest(req, ctx.params);

export const PUT = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  proxyRequest(req, ctx.params);

export const DELETE = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  proxyRequest(req, ctx.params);
