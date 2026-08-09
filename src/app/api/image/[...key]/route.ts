import { mimeFor, readImage } from "@/lib/images";

export const dynamic = "force-dynamic";

/** Serves uploaded project images (`/api/image/uploads/<uuid>.<ext>`). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const keyPath = key.join("/");

  if (!keyPath.startsWith("uploads/") || !/^uploads\/[\w.-]+$/.test(keyPath)) {
    return new Response("Not found", { status: 404 });
  }

  const data = await readImage(keyPath);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": mimeFor(keyPath),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
