import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
env.split('\n').forEach(l => { const m = l.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); });

const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const docs = google.docs({ version: 'v1', auth });

const DOC_ID = '1fvhFKvl6R944q3gBTTJdlrXjuIADx_6Id98OOPhThBU';

// Clear doc
const doc = await docs.documents.get({ documentId: DOC_ID });
const endIndex = doc.data.body.content.at(-1).endIndex;
if (endIndex > 2) {
  await docs.documents.batchUpdate({ documentId: DOC_ID, requestBody: { requests: [{ deleteContentRange: { range: { startIndex: 1, endIndex: endIndex - 1 } } }] } });
}
console.log('Cleared doc');

const content = `BRIEF — Rewrite: AI Virtual Assistants for Property Managers

Page: AI Virtual Assistants for Property Managers
URL: /resources/ai-virtual-assistants-property-managers/
Work type: Rewrite · Pillar: Agent (secondary: Speed)
Author: Juan Leal
Date: July 2026
Word target: 800–1,000 words
Consolidations flowing in: 9 (chatbot + AI phone-response pages)
Visitas GA4: 6 · Visitas GSC: 0
Posiciona: Sí · Keywords: Ninguna (libertad total para reestructurar)
Cluster: Leasing Automation & AI


Keyword foco

"ai leasing assistant"

Los 3 primeros resultados de Google usan este término en H1 y title tag. Es el término dominante del SERP. "ai virtual assistant property management" es más largo y tiene menor volumen.


Análisis top 3 de Google para "ai leasing assistant"

Posición 1: ButterflyMX
butterflymx.com/blog/ai-leasing-assistant/
Formato: blog post, listicle de 11 herramientas. ~3,000 palabras.
H1: AI Leasing Assistant: What Is It, the Best Options, & More
H2s: What is artificial intelligence? · What is an AI leasing assistant? · How AI leasing agents benefit real estate · 11 AI leasing assistants to consider
Fuentes: cero.
Debilidades: sin datos respaldados, genérico ("What is AI?" no aporta), no menciona teléfono/voz como canal, no tiene casos de uso ni testimonios, no diferencia chatbot vs agente conversacional.

Posición 2: AppFolio (Lisa)
appfolio.com/services/ai-leasing-assistant
Formato: landing page de producto con formulario de demo. ~300 palabras.
H1: Meet Your AI Leasing Assistant, Lisa
H2s: Never Miss a Lead · Transform Your Leasing Operations with AI
Fuentes: cita "71% of renters expect a response within a day" y "40% of renter leads go unanswered" sin fuente.
Debilidades: no es contenido, es landing page corta. Stats sin fuente. Solo un testimonio (Nicole Rivera, SilverBrick Group, 642+ units). Cero profundidad educativa.

Posición 3: GPTBots
gptbots.ai/blog/ai-leasing-assistant
Formato: blog post, listicle de 6 herramientas. ~2,500 palabras.
H1: 6 Best AI Virtual Leasing Assistants to Consider in 2026
H2s: What is an AI Leasing Assistant? · How Does AI Virtual Leasing Agent Transform? · 6 AI Leasing Assistants to Consider · FAQ
Fuentes: cero.
Debilidades: se auto-pone #1 (GPTBots no es herramienta de leasing), dice "2025" en el body pero "2026" en el título, sin datos ni testimonios, no menciona teléfono/voz.

Oportunidades para Leasey:
1. Ninguno de los top 3 cita fuentes reales. Ganar con datos verificados.
2. Ninguno cubre el canal de teléfono/voz con profundidad. Liza es diferenciador.
3. Ninguno tiene testimonios reales de operadores.
4. Los 3 son listicles superficiales. Un artículo educativo con ángulo de operador gana.
5. Ninguno conecta "chatbot + phone agent" como pipeline unificado.


Meta

Meta title: AI Leasing Assistant: Chatbots and Phone Agents (47 chars)
Contiene keyword foco al inicio. Diferenciador: ningún competidor cubre ambos canales en el título.

Meta description: What an AI leasing assistant does for property managers: chatbots, AI phone agents, and instant showing booking. See it on your own listings. (143 chars)
Keyword foco en la primera frase. Cierra con curiosidad/CTA suave.


Proposed structure

[H1] AI Leasing Assistant: Chatbots, Phone Agents, and What Actually Works

[H2] The problem: after-hours enquiries kill your pipeline
Dato de apertura: Zillow Group Consumer Housing Trends Report (76% of renters expect a response within 24 hours). Contrastar con la realidad: 40–60% of leads go unanswered (fuente a verificar).

[H2] What an AI leasing assistant actually does
Definición funcional (no "what is AI"). Tres capacidades: respond, qualify, schedule. Diferencia vs chatbot rule-based.

[H2] AI leasing chatbots
Qué resuelven (FAQs, listing details, availability). Qué no resuelven (llamadas, intención compleja). Cómo encajan en el funnel.

[H2] AI phone agents
El canal que los competidores ignoran. Liza: responde llamadas 24/7, agenda showings, prequalifica.
Testimonial: Jaycy Pierre, AEDN — "The most valuable impact of Leasey.AI on my leasing workflow has been the ability to communicate with leads 24/7 with the help of AI. It has greatly streamlined the process through automation of lead communication, especially via Facebook Marketplace."

[H2] Chatbot + phone agent on one pipeline
La tesis: ambos canales alimentan un solo pipeline de leasing. Sin duplicación de leads, sin seguimiento manual.
Link interno: /resources/centralized-leasing/

[H2] What changes for your team
Impacto operativo: response rate 100% vs 30–40% manual, reducción de tareas manuales ~90%, 48+ marketplaces syndication.
Testimonial: David Betesh, Rockwell Properties LLC — "Since using it, our response time and follow-through have improved, and our leasing workflow is more consistent and efficient."
Alternativa: Robyn Lockhart, Aquilini Investment Group — "...we're now seeing far more people actually attend our tours. In just a few months, we've already signed several leases through Leasey..."

[H2] Next step
CTA: "Book a demo to see Liza handle a live enquiry on your own listings."
Link: https://www.leasey.ai/get-started/

Author box: Juan Leal, CEO & CPO at Leasey.AI
Link: /author/juan-leal


Sources

1. Zillow Group Consumer Housing Trends Report 2024
   Dato: 76% of renters expect a response within 24 hours of their enquiry.
   URL: https://www.zillow.com/research/consumer-housing-trends-report-2024/

2. Leasey.AI product facts (self-sourced)
   100% response rate (vs 30–40% manual), ~90% leasing task automation, 48+ marketplaces, Liza supports English/Spanish/French.

3. NMHC / Grace Hill Renter Preferences Survey 2024
   Dato: [VERIFICAR] porcentaje de leads que no reciben respuesta.
   URL: [VERIFICAR]


Product data (verified against products.md)

Liza: agente IA de teléfono y chat 24/7 (no chatbot, agente conversacional completo).
48+ marketplaces (Zillow, Zumper, Kijiji, Facebook Marketplace, Apartments.com, Trulia, HotPads).
~90% leasing task automation.
100% response rate (vs 30–40% manual).
Showing Scheduler con confirmaciones y recordatorios anti no-show.
Liza soporta English, Spanish, French y más.
Integrations: Yardi, Buildium, Rent Manager.
No PMS integration required to start.

No mencionar en este artículo: tenant screening details, Smart Leases/eSignature, Market Rent Comparison (otros clusters).


Images

1. Hero/featured image — antes del H2 "The problem"
   Dashboard de leasing con notificaciones de chat y llamada entrante. Colores Leasey.
   Alt: "AI leasing assistant dashboard showing chat and phone enquiries"
   WebP, max 1200x630px

2. Chatbot vs phone agent comparison — entre H2 "AI leasing chatbots" y H2 "AI phone agents"
   Diagrama de dos columnas: izquierda = chatbot, derecha = phone agent. Centro = pipeline unificado.
   Alt: "Comparison of AI leasing chatbot and AI phone agent capabilities"
   WebP, max 800x500px

3. Pipeline diagram — en H2 "Chatbot + phone agent on one pipeline"
   Flujo horizontal: Lead sources → AI leasing assistant (Liza) → Qualified lead → Showing → Application.
   Alt: "Unified leasing pipeline from lead sources through AI assistant to signed lease"
   WebP, max 1000x400px


Internal links

1. /resources/centralized-leasing/ — en H2 "Chatbot + phone agent on one pipeline"
2. /resources/testimonials/ — en la mención de Goldwynn
3. /resources/showing-scheduler/ — en H2 "AI phone agents"
4. /get-started/ — CTA final


Target keywords

Primary: ai leasing assistant → H1, title tag, intro, meta description
Secondary: ai phone agent for property management → H2 "AI phone agents," body of Liza section
Secondary: 24/7 leasing / automated lead response → H2 "The problem," body
Long-tail: ai assistant for property managers → Body (natural variation)
Body: virtual leasing assistant → Body (synonym, 1–2 uses)
Contextual: ai answering service for property management → H2 "AI phone agents"
Contextual: leasing chatbot for apartments → H2 "AI leasing chatbots"
Contextual: automated rental lead response → H2 "The problem" / pipeline section

Keyword foco aparece en H1, title tag, meta description, intro, y 2–3 veces natural en el body. Secundarias 1 vez cada una en su sección. Sin stuffing.


Writing rules

Intro: responder la intención de búsqueda en el primer párrafo. Máximo 3 líneas. Zero links.
Párrafos: máximo 4 líneas. Oraciones cortas. Voz activa.
Bold: solo frases clave para scan mode, no oraciones enteras. Máximo 2–3 por sección H2.
British English (organisation, colour, behaviour, prioritise). Oxford comma. Zero em-dashes. "Leasey.AI" capitalisation. No keyword stuffing.
`;

// Insert text
await docs.documents.batchUpdate({
  documentId: DOC_ID,
  requestBody: { requests: [{ insertText: { location: { index: 1 }, text: content } }] }
});
console.log('Text inserted');

// Now get the doc to find positions for links and formatting
const doc2 = await docs.documents.get({ documentId: DOC_ID });
const fullText = doc2.data.body.content.map(b => b.paragraph?.elements?.map(e => e.textRun?.content || '').join('') || '').join('');

// Define links to add
const links = [
  { text: 'butterflymx.com/blog/ai-leasing-assistant/', url: 'https://butterflymx.com/blog/ai-leasing-assistant/' },
  { text: 'appfolio.com/services/ai-leasing-assistant', url: 'https://www.appfolio.com/services/ai-leasing-assistant' },
  { text: 'gptbots.ai/blog/ai-leasing-assistant', url: 'https://www.gptbots.ai/blog/ai-leasing-assistant' },
  { text: 'https://www.zillow.com/research/consumer-housing-trends-report-2024/', url: 'https://www.zillow.com/research/consumer-housing-trends-report-2024/' },
  { text: 'https://www.leasey.ai/get-started/', url: 'https://www.leasey.ai/get-started/' },
  { text: '/resources/centralized-leasing/', url: 'https://www.leasey.ai/resources/centralized-leasing/' },
  { text: '/resources/testimonials/', url: 'https://www.leasey.ai/resources/testimonials/' },
  { text: '/resources/showing-scheduler/', url: 'https://www.leasey.ai/resources/showing-scheduler/' },
  { text: '/author/juan-leal', url: 'https://www.leasey.ai/author/juan-leal' },
];

// Build link requests
const linkRequests = [];
for (const link of links) {
  // Find first occurrence in fullText (offset by 1 for doc index)
  const idx = fullText.indexOf(link.text);
  if (idx >= 0) {
    const startIndex = idx + 1; // doc indices are 1-based
    const endIndex = startIndex + link.text.length;
    linkRequests.push({
      updateTextStyle: {
        range: { startIndex, endIndex },
        textStyle: { link: { url: link.url } },
        fields: 'link'
      }
    });
  }
}

// Find section headers and make them bold (just the header lines)
const headers = [
  'Keyword foco',
  'Análisis top 3 de Google para "ai leasing assistant"',
  'Meta',
  'Proposed structure',
  'Sources',
  'Product data (verified against products.md)',
  'Images',
  'Internal links',
  'Target keywords',
  'Writing rules',
];

for (const h of headers) {
  const idx = fullText.indexOf('\n' + h + '\n');
  if (idx >= 0) {
    const startIndex = idx + 2; // +1 for doc offset, +1 for \n
    const endIndex = startIndex + h.length;
    linkRequests.push({
      updateTextStyle: {
        range: { startIndex, endIndex },
        textStyle: { bold: true },
        fields: 'bold'
      }
    });
  }
}

// Also remove any bold from the entire doc first, then apply selectively
// Actually let's just apply the link and header formatting
if (linkRequests.length > 0) {
  await docs.documents.batchUpdate({
    documentId: DOC_ID,
    requestBody: { requests: linkRequests }
  });
  console.log(`Applied ${linkRequests.length} formatting requests (links + bold headers)`);
}

console.log('Done! Open: https://docs.google.com/document/d/' + DOC_ID + '/edit');
