import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

const REW = 'C:/Users/wally/AppData/Local/Temp/claude/C--Users-wally-claude-code-app/07855119-49e9-4618-bd86-b88ac36d89ac/scratchpad/rewrites';
const OUTMAP = path.join(REW, '_doc-map.csv');

const idx = {};
for (const line of fs.readFileSync(path.join(REW, '_index.md'), 'utf8').split('\n')) {
  const m = line.match(/^(\d\d) \| (.+?) \| (.+?) \| (.+?)kw \| (.*)$/);
  if (m) idx[m[1]] = { slug: m[2], pillar: m[3], url: `https://www.leasey.ai/${m[2]}` };
}

// existing doc ids (to update in place)
const existing = {};
if (fs.existsSync(OUTMAP)) {
  for (const line of fs.readFileSync(OUTMAP, 'utf8').split('\n').slice(1)) {
    const c = line.split(','); if (!c[0]) continue;
    const dm = (c[3]||'').match(/\/document\/d\/([^/]+)/);
    if (dm) existing[c[0]] = dm[1];
  }
}

function meta(html) {
  const m = html.match(/<!--\s*META:([\s\S]*?)-->/);
  if (!m) return {};
  const p = m[1].split('|').map(s => s.trim());
  const get = (label) => { const hit = p.find(x => x.startsWith(label)); return hit ? hit.slice(label.length).trim() : ''; };
  return { title: p[0]||'', desc: p[1]||'', slug: p[2]||'', kw: p[3]||'', author: get('AUTHOR:') };
}

const files = fs.readdirSync(REW).filter(f => /^out-\d\d\.html$/.test(f)).sort();
const rows = [];
for (const f of files) {
  const n = f.match(/out-(\d\d)\.html/)[1];
  const html = fs.readFileSync(path.join(REW, f), 'utf8');
  const info = idx[n] || {};
  const md = meta(html);
  const title = (md.title || `Rewrite ${n}`);
  // clean body: strip META + COMPLIANCE comments; render image placeholder as a visible note
  let body = html.replace(/<!--\s*META:[\s\S]*?-->/g, '').replace(/<!--\s*COMPLIANCE:[\s\S]*?-->/g, '');
  body = body.replace(/<img\s+src="\[IMAGE:([^\]]*)\]"\s+alt="([^"]*)"\s*\/?>/gi,
    (_, d, alt) => `<p style="background:#fff3cd;padding:8px;">\u{1F5BC}️ <b>[IMAGE]</b> alt: "${alt}" — ${d.trim()} <i>(add the real image in WordPress)</i></p>`);
  const header = `<p style="background:#eef;padding:8px;font-size:13px;">` +
    `<b>Target URL:</b> ${info.url || ''} &nbsp;|&nbsp; <b>Author:</b> ${md.author || ''}<br>` +
    `<b>Meta title:</b> ${md.title || ''}<br>` +
    `<b>Meta description:</b> ${md.desc || ''}<br>` +
    `<b>Slug:</b> ${md.slug || ''} &nbsp;|&nbsp; <b>Keyword:</b> ${md.kw || ''}</p><hr>`;
  const full = `<html><body>${header}${body}</body></html>`;
  const media = { mimeType: 'text/html', body: Readable.from(Buffer.from(full, 'utf8')) };
  try {
    let id;
    if (existing[n]) {
      await drive.files.update({ fileId: existing[n], media });
      id = existing[n];
      console.log(`UPDATED ${n} -> https://docs.google.com/document/d/${id}/edit`);
    } else {
      const res = await drive.files.create({
        requestBody: { name: `REWRITE ${n} — ${title}`, mimeType: 'application/vnd.google-apps.document' },
        media, fields: 'id',
      });
      id = res.data.id;
      console.log(`CREATED ${n} -> https://docs.google.com/document/d/${id}/edit`);
    }
    rows.push(`${n},${info.slug || ''},${info.url || ''},https://docs.google.com/document/d/${id}/edit,${md.author || ''}`);
  } catch (e) { console.error(`FAIL ${n}: ${e.message}`); }
}
fs.writeFileSync(OUTMAP, 'n,slug,target_url,doc_url,author\n' + rows.join('\n') + '\n');
console.log(`\nDone. ${rows.length} docs. Map at ${OUTMAP}`);
