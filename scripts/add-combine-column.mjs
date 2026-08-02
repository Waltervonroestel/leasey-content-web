import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const pages = JSON.parse(readFileSync('page-content-audit.json', 'utf8'));

function extractKeywords(text) {
  if (!text) return new Set();
  const stops = new Set(['the','a','an','in','on','at','to','for','of','and','or','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','out','off','down','this','that','these','those','it','its','not','no','but','what','which','who','whom','how','when','where','why','all','each','every','both','few','more','most','other','some','such','than','too','very','just','also','only','then','so','if','as','any','same','own','here','there','your','our','their','my','his','her','we','you','they','he','she','me','us','him','them','one','two','three','new','old','good','best','top','key','use','using','get','make','like','need','way','well','even','many','much','still','back','take','come','see','look','find','give','first','last','long','great','high','right','big','small','work','time','year','day','free','full','real','help','know','think','want','let','keep','try','start','turn','call','part','sure','put','set','run','end','number','point','fact','case','thing','idea','question','business','company','companies','service','services','solution','solutions','system','systems','software','management','manager','managers','data','process','tools','tool','platform','team','teams','guide','article','read','learn','check','review','report','page','resources','blog','press','benefits','research','insights','news','listing','listings','property','properties','rental','rentals','tenant','tenants','landlord','landlords','lease','leasing','rent','renting','apartment','apartments','building','buildings','unit','units','market','industry','including','without','based','related','different','important','essential','effective','complete','comprehensive','specific','common','various','available','current','future','modern','smart','online','digital','real','estate']);
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>2&&!stops.has(w)));
}
function jaccardSim(a,b){if(!a.size||!b.size)return 0;let i=0;for(const w of a)if(b.has(w))i++;return i/(a.size+b.size-i);}
function sig(p){return extractKeywords([p.h1||'',p.meta||'',...(p.h2s||[]),p.bodyText||''].join(' '));}

const clusters={};
for(const p of pages){if(!clusters[p.cluster])clusters[p.cluster]=[];clusters[p.cluster].push(p);}

// For each page, find the best combine target (highest performance page with >=25% similarity)
const combineTargets = new Array(pages.length).fill('');

for (const p of pages) {
  const cp = clusters[p.cluster] || [];
  const myKw = sig(p);
  const perf = p.clicks + p.visits;

  let bestTarget = null;
  let bestSim = 0;

  for (const o of cp) {
    if (o.idx === p.idx) continue;
    const sim = jaccardSim(myKw, sig(o));
    const operf = o.clicks + o.visits;
    if (sim >= 0.20 && operf > perf && sim > bestSim) {
      bestSim = sim;
      bestTarget = o;
    }
  }

  // If no better-performing page, find most similar regardless of performance
  if (!bestTarget) {
    for (const o of cp) {
      if (o.idx === p.idx) continue;
      const sim = jaccardSim(myKw, sig(o));
      if (sim >= 0.25 && sim > bestSim) {
        bestSim = sim;
        bestTarget = o;
      }
    }
  }

  if (bestTarget) {
    combineTargets[p.idx] = `https://www.leasey.ai${bestTarget.url}`;
  }
}

// Write column K
const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: o });
const SHEET_ID = process.env.OPTIMISATION_SHEET_ID;

// Header
await sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: `'Optimisation map'!K1`,
  valueInputOption: 'RAW',
  requestBody: { values: [['Combine with']] },
});

// Data in batches
const values = combineTargets.map(t => [t]);
const BATCH = 200;
for (let i = 0; i < values.length; i += BATCH) {
  const batch = values.slice(i, i + BATCH);
  const startRow = i + 2;
  const endRow = startRow + batch.length - 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `'Optimisation map'!K${startRow}:K${endRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: batch },
  });
  console.log(`Wrote rows ${startRow}-${endRow}`);
}

const filled = combineTargets.filter(t => t).length;
console.log(`\nDone. Column K "Combine with" added. ${filled} pages have a combine target.`);
