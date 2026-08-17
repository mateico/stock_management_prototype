// googleapis/google-auth-library relies on Node internals that don't work
// correctly under the Cloudflare Workers runtime (workerd), even with
// nodejs_compat — JWT signing silently produces tokens Google rejects with
// 401. Auth is implemented here manually with the Web Crypto API + fetch,
// which both work identically in Node (next dev) and Workers (preview/deploy).

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
// Tab name inside the spreadsheet. Wrap in single quotes if it ever contains
// spaces (e.g. "'Current Orders'").
const SHEET_NAME = "Current";
const SHEET_RANGE = `${SHEET_NAME}!A:I`;

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function base64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim().replace(/^["']|["']$/g, "");
  // Secrets pasted via `wrangler secret put` keep surrounding quotes and literal
  // "\n" as-is (unlike .env/.dev.vars parsers, which strip/interpret them).
  const privateKeyPem = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
  if (!clientEmail || !privateKeyPem) {
    throw new Error("Missing GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${base64url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Google access token: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function sheetsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim().replace(/^["']|["']$/g, "");

  const response = await fetch(`${SHEETS_API}/${spreadsheetId}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets API error: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export async function getSheetData(): Promise<string[][]> {
  const data = await sheetsFetch<{ values?: string[][] }>(
    `/values/${encodeURIComponent(SHEET_RANGE)}`,
  );
  return data.values || [];
}

export async function updatePanItem(
  rowNumber: number,
  values: { cant: number; pqt: number; nota2: string; empaque: string },
): Promise<void> {
  const range = `${SHEET_NAME}!D${rowNumber}:G${rowNumber}`;

  await sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({
      values: [[values.cant, values.pqt, values.nota2, values.empaque]],
    }),
  });
}

export async function updateClienteHeader(
  rowNumber: number,
  values: { chofer: string; distribucion: string },
): Promise<void> {
  const range = `${SHEET_NAME}!H${rowNumber}:I${rowNumber}`;

  await sheetsFetch(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({
      values: [[values.chofer, values.distribucion]],
    }),
  });
}
