import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const wpAuth = Buffer.from(`${env.WORDPRESS_USER}:${env.WORDPRESS_APP_PASSWORD}`).toString('base64');
const wpBase = env.WORDPRESS_URL;

async function fetchPost(id, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(`${wpBase}/wp-json/wp/v2/posts/${id}?context=edit`, {
        headers: { 'Authorization': `Basic ${wpAuth}` },
        signal: AbortSignal.timeout(30000),
      });
      const j = await r.json();
      return { id, title: j.title?.raw || '', raw: j.content?.raw || '' };
    } catch (e) {
      console.log(`  Retry ${i + 1}/${retries} for ${id}: ${e.message}`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth: o });

const fixes = [
  { postId: 30048, docId: '1a_aMjfmFKw8hgAkXLN8Om3F6sln8LKPWahuECfW-CDM' },
  { postId: 30054, docId: '1-FQ0IAIJY6zf4EJmVmf3ir0JgJtJm_JDCBxOv1nnzMI' },
  { postId: 30079, docId: '1YVkgH0Hfu-L54BP8uOrID1zns1UD27wrC4PFPqhbcUw' },
];

for (const fix of fixes) {
  console.log(`Fetching post ${fix.postId}...`);
  const post = await fetchPost(fix.postId);
  console.log(`  Title: ${post.title.substring(0, 60)} (${post.raw.length} chars)`);

  if (post.raw.length < 100) {
    console.log(`  EMPTY, skipping`);
    continue;
  }

  // Get current doc length to append at end
  const doc = await docs.documents.get({ documentId: fix.docId });
  const endIndex = doc.data.body.content.at(-1).endIndex - 1;

  const textToInsert = `\n\n${post.title}\nOriginal WordPress Draft ID: ${post.id}\n\n${post.raw.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()}\n\n---\n`;

  await docs.documents.batchUpdate({
    documentId: fix.docId,
    requestBody: {
      requests: [
        { insertText: { location: { index: endIndex }, text: textToInsert } },
      ]
    }
  });
  console.log(`  Appended to doc`);
}

console.log('Done!');
