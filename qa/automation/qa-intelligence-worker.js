const AUD = "bucklerfamily-qa-refresh";
const REPO = "unclehowell/cedwyn-qa";
const WORKFLOW = "unclehowell/cedwyn-qa/.github/workflows/daily-qa-refresh.yml@refs/heads/main";
const MODEL = "openrouter/auto";

function decodePart(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), c => c.charCodeAt(0))));
}

function decodeSignature(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

async function verifyGithubOidc(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  let header, claims;
  try {
    header = decodePart(parts[0]);
    claims = decodePart(parts[1]);
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (header.alg !== "RS256" || claims.iss !== "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Ftoken.actions.githubusercontent.com") return false;
  if (!(claims.aud === AUD || (Array.isArray(claims.aud) && claims.aud.includes(AUD)))) return false;
  if (claims.repository !== REPO || claims.repository_owner !== "unclehowell") return false;
  if (claims.ref !== "refs/heads/main" || claims.workflow_ref !== WORKFLOW) return false;
  if (!claims.exp || claims.exp < now || !claims.iat || claims.iat > now + 60 || now - claims.iat > 900) return false;

  const response = await fetch("https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Ftoken.actions.githubusercontent.com%2F.well-known%2Fjwks", {
    cf: { cacheTtl: 300 }
  });
  if (!response.ok) return false;

  const jwks = await response.json();
  const jwk = (jwks.keys || []).find(key => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) return false;

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    publicKey,
    decodeSignature(parts[2]),
    new TextEncoder().encode(parts[0] + "." + parts[1])
  );
}

const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

export default {
  async fetch(request, env) {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/v1/refresh") {
      return json({ error: "not_found" }, 404);
    }
    if (!env.OPENROUTER_API_KEY) return json({ error: "not_configured" }, 503);

    const token = (request.headers.get("authorization") || "").replace(/^Bearer\\s+/i, "");
    try {
      if (!token || !(await verifyGithubOidc(token))) {
        return json({ error: "unauthorised_workflow" }, 401);
      }
    } catch {
      return json({ error: "workflow_authentication_failed" }, 401);
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 1200000) return json({ error: "input_too_large" }, 413);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    if (
      !body ||
      !Array.isArray(body.messages) ||
      body.messages.length !== 2 ||
      !body.messages.every(message =>
        ["system", "user"].includes(message.role) && typeof message.content === "string"
      )
    ) {
      return json({ error: "invalid_messages" }, 400);
    }
    if (JSON.stringify(body).length > 1200000) return json({ error: "input_too_large" }, 413);

    const upstream = await fetch("https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fopenrouter.ai%2Fapi%2Fv1%2Fchat%2Fcompletions", {
      method: "POST",
      headers: {
        "authorization": "Bearer " + env.OPENROUTER_API_KEY,
        "content-type": "application/json",
        "http-referer": "https://cedwyn.bucklerfamily.estate/dartboard/qa/",
        "x-title": "Buckler Family Estate Q&A Refresh"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: body.messages,
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 8000
      })
    });

    if (!upstream.ok) return json({ error: "inference_provider_error", status: upstream.status }, 502);

    let result;
    try {
      result = await upstream.json();
    } catch {
      return json({ error: "invalid_provider_response" }, 502);
    }

    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) return json({ error: "empty_model_response" }, 502);

    return json({
      ok: true,
      model: result.model || MODEL,
      usage: result.usage || null,
      content
    });
  }
};
