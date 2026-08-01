// Autoriza el acceso de lectura a GA4 y deja el refresh token listo para pegar
// en .env.local.
//
// Hace falta un token aparte porque el que ya existe solo tiene scope de Drive
// y Sheets: los scopes se conceden al autorizar y no se pueden ampliar después.
//
// Uso:  node scripts/auth-ga4.mjs
import http from "node:http";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = ["https://www.googleapis.com/auth/analytics.readonly"];

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Faltan GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local");
  process.exit(1);
}

const oauth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT);
const url = oauth.generateAuthUrl({
  access_type: "offline",
  scope: SCOPE,
  // Sin esto Google devuelve la concesión existente sin refresh_token nuevo.
  prompt: "consent",
});

console.log("\nAbre esta URL en el navegador y autoriza:\n");
console.log(url + "\n");
console.log(`Esperando en ${REDIRECT} ...\n`);

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth2callback")) return res.end();
  const code = new URL(req.url, `http://localhost:${PORT}`).searchParams.get("code");
  if (!code) {
    res.end("Falta el código.");
    return;
  }

  try {
    const { tokens } = await oauth.getToken(code);
    res.end("Listo. Puedes cerrar esta pestaña y volver a la terminal.");

    console.log("Pega esto en .env.local:\n");
    console.log(`GA4_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    // Y de paso, listar las propiedades a las que da acceso, para no tener que
    // buscar el ID a mano en la interfaz de GA4.
    oauth.setCredentials(tokens);
    const admin = google.analyticsadmin({ version: "v1beta", auth: oauth });
    try {
      const accounts = await admin.accountSummaries.list({ pageSize: 50 });
      console.log("Propiedades disponibles:\n");
      for (const a of accounts.data.accountSummaries || []) {
        for (const p of a.propertySummaries || []) {
          const id = String(p.property || "").replace("properties/", "");
          console.log(`  GA4_PROPERTY_ID=${id}   ${p.displayName}  (${a.displayName})`);
        }
      }
      console.log("\nCopia la línea de la propiedad del sitio a .env.local.\n");
    } catch {
      console.log("No se pudieron listar las propiedades. Busca el ID numérico en");
      console.log("GA4 > Admin > Property details.\n");
    }
  } catch (e) {
    console.error("Error al canjear el código:", e.message);
  }
  server.close();
  process.exit(0);
});

server.listen(PORT);
