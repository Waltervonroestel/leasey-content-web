import { readFileSync } from 'fs';
import { google } from 'googleapis';

const envFile = readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const manifest = JSON.parse(readFileSync('aeo-manifest.json', 'utf8'));
const blogs = manifest.blogs || [];

const o = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth: o });

function isH1(text, idx) {
  return idx === 0 && text.length > 10;
}

function isFaqQuestion(text, inFaq) {
  if (!inFaq) return false;
  return text.endsWith('?') && text.length < 200 && text.length > 10;
}

function isH2(text) {
  const t = text.trim();
  if (t.length < 5 || t.length > 200) return false;
  if (t.endsWith('?')) return true;
  if (/^(the |how |what |when |where |why |which |who |can |do |does |is |are |should |frequently|faq|closing|schedule a call|written by)/i.test(t)) return true;
  if (/^(1\.|2\.|3\.|4\.|5\.|6\.|7\.|8\.)\s/.test(t)) return false;
  const words = t.split(/\s+/);
  if (words.length <= 15 && !t.includes('.') && !t.includes(',')) return true;
  return false;
}

async function formatDoc(docId, row) {
  const doc = await docs.documents.get({ documentId: docId });
  const content = doc.data.body.content || [];

  const paragraphs = [];
  for (const el of content) {
    if (!el.paragraph) continue;
    const text = el.paragraph.elements
      .map(e => (e.textRun ? e.textRun.content : ''))
      .join('')
      .trim();
    if (!text) continue;
    paragraphs.push({
      text,
      startIndex: el.startIndex,
      endIndex: el.endIndex,
      currentStyle: el.paragraph.paragraphStyle?.namedStyleType || 'NORMAL_TEXT',
    });
  }

  if (paragraphs.length === 0) return 'empty';

  const requests = [];
  let inFaq = false;
  let headingCount = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const t = p.text.trim();

    if (/^frequently asked questions$/i.test(t) || /^faq$/i.test(t)) {
      inFaq = true;
    }

    let targetStyle = null;

    if (i === 0) {
      targetStyle = 'HEADING_1';
    } else if (/^(written by|schedule a call|book a demo)/i.test(t)) {
      // CTA or author line - keep as normal
      targetStyle = null;
    } else if (inFaq && isFaqQuestion(t, inFaq)) {
      targetStyle = 'HEADING_3';
    } else if (!inFaq && isH2(t)) {
      targetStyle = 'HEADING_2';
    } else if (/^frequently asked questions$/i.test(t) || /^faq$/i.test(t)) {
      targetStyle = 'HEADING_2';
    }

    if (targetStyle && p.currentStyle !== targetStyle) {
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: p.startIndex, endIndex: p.endIndex },
          paragraphStyle: { namedStyleType: targetStyle },
          fields: 'namedStyleType',
        },
      });
      headingCount++;
    }
  }

  if (requests.length > 0) {
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    });
  }

  return `${requests.length} headings applied`;
}

async function main() {
  let ok = 0, fail = 0;
  for (const blog of blogs) {
    try {
      const result = await formatDoc(blog.docId, blog.row);
      console.log(`Row ${blog.row}: ${result}`);
      ok++;
    } catch (e) {
      console.log(`Row ${blog.row} FAIL: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
}

main();
