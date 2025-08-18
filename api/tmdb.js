export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) return new Response(JSON.stringify({ results: [] }), { status: 200 });

  const key = process.env.TMDB_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "TMDB_API_KEY not set" }), { status: 500 });

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(
    key
  )}&query=${encodeURIComponent(query)}`;

  const r = await fetch(url);
  const data = await r.json();

  // CORS open so frontend can call it
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}
