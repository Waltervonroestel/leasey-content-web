import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth });

const data = [
  ['#', 'Lead Magnet', 'Blog Cluster', 'Description', 'Type', 'Status', 'Lovable URL', 'Lovable Prompt (Google Doc)', 'Email Capture'],
  [
    '1',
    'Leasing Funnel Diagnostic',
    'Leasing Automation & AI',
    'Property managers input their real funnel numbers (views, inquiries, showings, apps, signed leases) and get an instant diagnosis: where leads die, benchmark comparisons by portfolio size, bottleneck cards with causes + fixes, 6 editable message templates in 3 tones (inquiry response, showing confirmation, reminders, follow-up, no-show recovery), a 15-minute showing script, and response-time benchmarks. Email-gated after analysis.',
    'Interactive diagnostic tool',
    'Built in Lovable',
    'https://claude.ai/code/artifact/f7e3efb8-8c86-410e-a246-ca3139221628',
    '',
    'Email gate before results'
  ],
  [
    '2',
    'Rental Listing Generator',
    'Listings & Marketing',
    'Property managers fill in property details (address, beds, baths, sqft, rent, amenities, pet policy, parking, etc.) and get 5 platform-specific listings (Zillow, Apartments.com, FB Marketplace, Zumper, Craigslist) in 3 tones (Professional, Casual, Urgent). Each listing is editable inline with copy button. Includes a 100-point quality checklist (Photos 40pts, Description 30pts, Accuracy 20pts, Distribution 10pts) with expandable tips per item. Email-gated after generation.',
    'Interactive generator tool',
    'Built in Lovable',
    'https://claude.ai/code/artifact/8401f0ef-3576-470c-9f1e-97cba5f66f76',
    '',
    'Email gate before results'
  ],
  [
    '3',
    'Tenant Screening Criteria Builder',
    'Screening & Compliance',
    'Property managers select their state, set screening criteria via sliders and toggles (credit score threshold, income-to-rent ratio, eviction lookback, criminal lookback, reference requirements), and the tool generates a compliant screening policy document. Includes state-specific legal warnings (ban-the-box, source-of-income protections), a compliance checklist, and a downloadable PDF policy. Email-gated before download.',
    'Interactive policy builder',
    'Lovable prompt ready',
    'https://leasey-policy-pilot.lovable.app/',
    'https://docs.google.com/document/d/1-T8_s6wtoVwY_Ek7yK2N_nskFHKUmI52IwDzJxfYY0A/edit',
    'Email gate before PDF download'
  ],
  [
    '4',
    'Rent Benchmark Report',
    'Market Insights',
    'Property managers select a city from 12 pre-loaded metros (8 US + 4 Canada) and get a one-page rent benchmark report: median rent, vacancy rate, YoY change, sourced from Apartment List, RealPage, CMHC, Rentals.ca, RentCafe, Census, and StatCan. Includes comp positioning (where their rent sits vs. market median) and a downloadable PDF. Cities with partial data show "coming soon" for missing metrics. Email-gated before PDF download.',
    'Interactive benchmark report',
    'Lovable prompt ready',
    'https://rent-spotlight-report.lovable.app/',
    'https://docs.google.com/document/d/1YYNivR57MPoE8OPsYy_OZH9NkFwiAFyo7fiDNcCIJak/edit',
    'Email gate before PDF download'
  ],
  [
    '5',
    '(Cluster 5: Press & Product Updates)',
    'Press & Product Updates',
    'No lead magnet assigned yet. This cluster covers company news, product launches, and press releases. Potential ideas: Product Roadmap Preview (gated early access), ROI Calculator, or Case Study Library.',
    'TBD',
    'Not started',
    '',
    '',
    ''
  ],
];

const res = await sheets.spreadsheets.create({
  requestBody: {
    properties: { title: 'Leasey Lead Magnets — by Cluster' },
    sheets: [{
      properties: { title: 'Lead Magnets', sheetId: 0 },
      data: [{ startRow: 0, startColumn: 0, rowData: data.map(row => ({
        values: row.map(cell => ({ userEnteredValue: { stringValue: cell } }))
      }))}]
    }]
  }
});

const ssId = res.data.spreadsheetId;
console.log('Sheet created:', ssId);

// Format header row
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: ssId,
  requestBody: { requests: [
    { repeatCell: {
      range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
      cell: { userEnteredFormat: {
        backgroundColor: { red: 0.09, green: 0.14, blue: 0.25 },
        textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 },
        horizontalAlignment: 'CENTER',
        wrapStrategy: 'WRAP'
      }},
      fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)'
    }},
    { updateDimensionProperties: {
      range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 },
      properties: { pixelSize: 500 }, fields: 'pixelSize'
    }},
    { updateDimensionProperties: {
      range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
      properties: { pixelSize: 280 }, fields: 'pixelSize'
    }},
    { updateDimensionProperties: {
      range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
      properties: { pixelSize: 200 }, fields: 'pixelSize'
    }},
    { updateDimensionProperties: {
      range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 6, endIndex: 9 },
      properties: { pixelSize: 300 }, fields: 'pixelSize'
    }},
    { repeatCell: {
      range: { sheetId: 0, startRowIndex: 1, endRowIndex: 6 },
      cell: { userEnteredFormat: { wrapStrategy: 'WRAP', verticalAlignment: 'TOP' } },
      fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
    }},
  ]}
});

console.log(`Open: https://docs.google.com/spreadsheets/d/${ssId}/edit`);
