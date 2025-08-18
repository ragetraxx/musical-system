export const config = { runtime: "edge" };

const VLC_UA = "VLC/3.0.18 LibVLC/3.0.18";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("url");
    if (!target) {
      return new Response("Missing url", { status: 400 });
    }

    // Stream the upstream response to the client
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": VLC_UA,
        // Some servers require Referer/Origin to be empty or same as host; we keep minimal.
      },
      redirect: "follow",
    });

    const headers = new Headers(upstream.headers);
    // Ensure CORS for the browser
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Expose-Headers", "*");

    // Some hosts forget content-type; default helps <video>
    if (!headers.get("content-type")) {
      headers.set("content-type", "video/mp4");
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (e) {
    return new Response("Proxy error: " + e.message, { status: 500 });
  }
}
