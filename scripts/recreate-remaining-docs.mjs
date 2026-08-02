import { readFileSync } from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

const envFile = readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const o = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
o.setCredentials({ refresh_token: env.GOOGLE_SHEETS_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: o });
const sheets = google.sheets({ version: 'v4', auth: o });

const TRACKER_ID = '1u0luDlk0ALAUNTZuWK181OyrmsomUbPF-2w-YB87QvY';

const DOCS = [
  {
    title: 'Leasey.AI — Leasing Operations Assessment (Combined Tool)',
    html: Buffer.from('PGh0bWw+PGhlYWQ+PG1ldGEgY29udGVudD0idGV4dC9odG1sOyBjaGFyc2V0PVVURi04IiBodHRwLWVxdWl2PSJjb250ZW50LXR5cGUiPjwvaGVhZD48Ym9keSBjbGFzcz0iZG9jLWNvbnRlbnQiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmY7bWF4LXdpZHRoOjQ2OHB0O3BhZGRpbmc6NzJwdCA3MnB0IDcycHQgNzJwdCI+PGgxIHN0eWxlPSJwYWRkaW5nLXRvcDoxMnB0O21hcmdpbjowO2NvbG9yOiMwMDAwMDA7Zm9udC13ZWlnaHQ6NzAwO3BhZGRpbmctbGVmdDowO2ZvbnQtc2l6ZToyNHB0O3BhZGRpbmctYm90dG9tOjEycHQ7Zm9udC1mYW1pbHk6JnF1b3Q7QXJpYWwmcXVvdDs7bGluZS1oZWlnaHQ6MS4wO3RleHQtYWxpZ246bGVmdDtwYWRkaW5nLXJpZ2h0OjAiPjxzcGFuIHN0eWxlPSJjb2xvcjojMDAwMDAwO2ZvbnQtd2VpZ2h0OjcwMDt0ZXh0LWRlY29yYXRpb246bm9uZTt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZTtmb250LXNpemU6MjRwdDtmb250LWZhbWlseTomcXVvdDtBcmlhbCZxdW90Oztmb250LXN0eWxlOm5vcm1hbCI+TGVhc2luZyBPcGVyYXRpb25zIEFzc2Vzc21lbnQg', 'base64').toString('utf8').substring(0, 10), // placeholder - will use full content
    trackerRow: 27,
  },
];

// The actual base64 content for all 4 docs
const docsData = [
  {
    title: 'Leasey.AI — Leasing Operations Assessment (Combined Tool)',
    base64: COMBINED_B64,
    trackerRows: [27],
  },
  {
    title: 'Leasey.AI — Leasing Automation for Large Portfolios',
    base64: LARGE_PORTFOLIO_B64,
    trackerRows: [7],
  },
  {
    title: 'Leasey.AI — Scaling Your PM Firm to New Markets',
    base64: SCALE_B64,
    trackerRows: [10],
  },
  {
    title: 'Leasey.AI — Why Generic CRMs Fail at Leasing',
    base64: CRM_B64,
    trackerRows: [13],
  },
];
