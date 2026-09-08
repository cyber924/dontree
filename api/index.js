import worker from "../dist/server/index.js";

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "dontree.co.kr";
  const pathValue = Array.isArray(req.query?.path) ? req.query.path.join("/") : (req.query?.path || "");
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === "path") continue;
    for (const item of Array.isArray(value) ? value : [value]) query.append(key, String(item));
  }

  const url = `${protocol}://${host}/${pathValue}${query.size ? `?${query}` : ""}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (Buffer.isBuffer(req.body)) body = req.body;
    else if (typeof req.body === "string") body = req.body;
    else if (req.body != null) body = JSON.stringify(req.body);
  }

  const response = await worker.fetch(new Request(url, { method: req.method, headers, body }), process.env);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(response.status).send(Buffer.from(await response.arrayBuffer()));
}
