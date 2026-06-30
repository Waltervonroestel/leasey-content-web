// Deterministic title/meta rewriter for CTR-fix queries — no AI.
// Applies SEO heuristics that consistently improve CTR.

const YEAR = new Date().getFullYear();

const POWER_PREFIXES: Record<string, string[]> = {
  question:      ["The Honest Answer", "Quick Guide", "Plain-English Guide"],
  comparison:    ["Honest Comparison", "Where Each Wins", "Real-World Verdict"],
  commercial:    ["Buyer's Guide", "Real Buyer's Guide", "What Operators Actually Pick"],
  local:         ["Canadian Operator's Guide", "Built for Canadian Rentals", "From a Canadian PM"],
  informational: ["Operator's Take", "Real Lessons", "What Actually Works"],
};

function classify(q: string): keyof typeof POWER_PREFIXES {
  const s = q.toLowerCase();
  if (/\bvs\b|comparison|alternative/.test(s)) return "comparison";
  if (/^(how |what |why |when |which |where |is |are |can |should |do |does )/.test(s)) return "question";
  if (/canada|canadian|ontario|alberta|vancouver|toronto|calgary|edmonton|montreal/.test(s)) return "local";
  if (/best|top \d|software|platform|pricing|cost|tool|crm/.test(s)) return "commercial";
  return "informational";
}

function titleCase(s: string): string {
  const small = new Set(["a", "an", "the", "and", "or", "but", "for", "to", "of", "on", "in", "at", "by", "vs"]);
  return s.split(" ").map((w, i) => {
    if (i > 0 && small.has(w.toLowerCase())) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(" ");
}

export interface TitleSuggestion {
  title: string;
  meta: string;
  rationale: string;
}

export function suggestTitles(query: string, position?: number): TitleSuggestion[] {
  const q = query.trim();
  const intent = classify(q);
  const cleanQ = titleCase(q);
  const suggestions: TitleSuggestion[] = [];

  // 1. Direct-answer pattern: lead with the literal query + year
  suggestions.push({
    title: `${cleanQ} (${YEAR} Guide)`,
    meta: `${capFirst(q)}? Practical answer from property operators, plus a free checklist. Updated ${YEAR}.`,
    rationale: "Incluye la query literal + año — Google premia frescura en queries 'best/how to'.",
  });

  // 2. Power-prefix pattern: emotional/value framing
  const prefix = POWER_PREFIXES[intent][0];
  suggestions.push({
    title: `${prefix}: ${cleanQ}`,
    meta: `Real PM perspective on "${q.toLowerCase()}". Honest, no fluff. Built for Canadian and US operators.`,
    rationale: "Power prefix sube el CTR sin perder el match con la query exacta.",
  });

  // 3. Listicle / specificity
  if (intent === "commercial" || intent === "comparison") {
    suggestions.push({
      title: `7 ${cleanQ} (Picked by Real PMs in ${YEAR})`,
      meta: `Compared on price, leasing AI, Canadian support, and integrations. The shortlist real operators are using in ${YEAR}.`,
      rationale: "Listicle con número impar + social proof (real PMs) — patrón con CTR históricamente alto.",
    });
  } else if (intent === "question") {
    suggestions.push({
      title: `${cleanQ}? Here's What Actually Works`,
      meta: `Straight answer to "${q.toLowerCase()}", plus the trade-offs nobody talks about.`,
      rationale: "AEO pattern: respuesta directa + gancho de honestidad ('what nobody talks about').",
    });
  } else {
    suggestions.push({
      title: `${cleanQ}: The ${YEAR} Operator's Playbook`,
      meta: `A practical playbook for ${q.toLowerCase()} — what worked for 50+ Canadian operators this year.`,
      rationale: "Promesa de utilidad + scarcity de año + social proof concreto.",
    });
  }

  // 4. Position-aware nudge: if rank is borderline (8-15), add urgency
  if (position && position >= 8 && position <= 15) {
    suggestions.push({
      title: `${cleanQ}: Why ${YEAR} Is Different`,
      meta: `Most guides on "${q.toLowerCase()}" are outdated. Here's what changed in ${YEAR} — and what to do.`,
      rationale: "Borderline ranking (pos 8-15) — el ángulo 'why this year is different' suele ganar CTR contra resultados estáticos.",
    });
  }

  return suggestions;
}

function capFirst(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
