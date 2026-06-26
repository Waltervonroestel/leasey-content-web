// Capa de análisis de GSC: convierte los números crudos en una lectura clara —
// qué significan, qué hacer y por qué. Todo determinístico (reglas sobre los
// datos), sin IA, así corre en Render al instante y es reproducible.

import { queryAnalytics, queryIntel, queryTrends, type EnrichedQuery } from "@/lib/gsc";

// CTR esperado por posición (mismo benchmark que lib/gsc).
function expectedCtr(pos: number): number {
  if (pos <= 1) return 0.27;
  if (pos <= 2) return 0.15;
  if (pos <= 3) return 0.1;
  if (pos <= 5) return 0.06;
  if (pos <= 7) return 0.035;
  if (pos <= 10) return 0.022;
  if (pos <= 15) return 0.012;
  if (pos <= 20) return 0.007;
  return 0.003;
}

export type Severity = "win" | "opportunity" | "watch" | "risk";

export interface Finding {
  id: string;
  severity: Severity;
  title: string;        // el titular corto
  metric: string;       // el número clave
  meaning: string;      // qué significa ese número
  action: string;       // qué hacer
  why: string;          // por qué, según ese número
  owner: "Walter" | "Alejandra" | "Walter + Alejandra";
  examples?: string[];  // queries de ejemplo
}

export interface GscAnalysis {
  connected: boolean;
  days: number;
  headline: {
    clicks: number;
    impressions: number;
    ctr: number;        // 0-1
    avgPosition: number;
    captureRate: number; // = ctr, pero nombrado para la narrativa
    summary: string;     // párrafo de lectura general
    verdict: Severity;
  };
  potentialClicks: {
    ctrFix: number;      // clicks recuperables arreglando títulos
    striking: number;    // clicks ganables empujando striking distance
    total: number;
  };
  findings: Finding[];
}

const round = (n: number) => Math.round(n);

export async function analyseGsc(days: number): Promise<GscAnalysis> {
  const [{ rows }, intel, trends] = await Promise.all([
    queryAnalytics("query", days),
    queryIntel(days),
    queryTrends(days),
  ]);

  const valid = rows.filter((r) => r.query && r.impressions > 0);
  const totalImpr = valid.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = valid.reduce((s, r) => s + r.clicks, 0);
  const ctr = totalImpr ? totalClicks / totalImpr : 0;
  // Posición media ponderada por impresiones (más honesta que el promedio simple).
  const avgPosition = totalImpr ? valid.reduce((s, r) => s + r.position * r.impressions, 0) / totalImpr : 0;

  // ── Upside cuantificado ────────────────────────────────────────────────────
  // CTR-fix: páginas en pos <=10 que rinden por debajo de lo esperado.
  let ctrFixClicks = 0;
  for (const e of intel.ctrFixes) {
    const gap = expectedCtr(e.position) * e.impressions - e.clicks;
    if (gap > 0) ctrFixClicks += gap;
  }
  // Striking distance: si suben a ~pos 5, ganan el CTR de pos 5.
  let strikingClicks = 0;
  for (const e of intel.striking) {
    const projected = expectedCtr(5) * e.impressions - e.clicks;
    if (projected > 0) strikingClicks += projected;
  }
  const potentialClicks = {
    ctrFix: round(ctrFixClicks),
    striking: round(strikingClicks),
    total: round(ctrFixClicks + strikingClicks),
  };

  // ── Lectura general ────────────────────────────────────────────────────────
  const captureRate = ctr;
  const upsidePct = totalClicks > 0 ? Math.round((potentialClicks.total / totalClicks) * 100) : 0;
  let verdict: Severity = "watch";
  let summary = "";
  const upsideTail =
    potentialClicks.total > 0
      ? ` Aun así, hay upside inmediato sin contenido nuevo: ~${potentialClicks.ctrFix.toLocaleString()} clics arreglando títulos de páginas que ya están en top-10 y ~${potentialClicks.striking.toLocaleString()} empujando striking distance (≈${potentialClicks.total.toLocaleString()} en total, ${upsidePct}% más).`
      : "";

  if (totalImpr === 0) {
    summary = "Todavía no hay suficiente data de GSC en este rango. Amplía a 90 días.";
    verdict = "watch";
  } else if (avgPosition > 18) {
    // Restricción dominante: la mayoría de las impresiones están en posiciones profundas.
    verdict = "risk";
    summary =
      `Hay mucha demanda (${totalImpr.toLocaleString()} impresiones de búsquedas con término conocido en ${days} días) pero la mayoría nos ven en posiciones profundas — posición media ${avgPosition.toFixed(1)}, por debajo de página 2. ` +
      `Por eso el CTR global es solo ${(captureRate * 100).toFixed(1)}%: casi nadie baja tan abajo. La prioridad real es subir rankings con piezas cornerstone, no más volumen.` +
      upsideTail;
  } else if (captureRate < 0.015 && totalImpr > 1000) {
    verdict = "opportunity";
    summary =
      `Hay demanda real: ${totalImpr.toLocaleString()} impresiones en ${days} días, pero solo se captura el ${(captureRate * 100).toFixed(1)}% en clics. ` +
      `Rankeamos decente (posición media ${avgPosition.toFixed(1)}) pero los títulos no se ganan el clic.` +
      upsideTail;
  } else {
    verdict = "win";
    summary =
      `${totalClicks.toLocaleString()} clics de ${totalImpr.toLocaleString()} impresiones (CTR ${(captureRate * 100).toFixed(1)}%, pos media ${avgPosition.toFixed(1)}). ` +
      `La base es sana. El crecimiento está en expandir los clusters que ya ganan y cerrar los ~${potentialClicks.total.toLocaleString()} clics de upside en títulos y striking distance.`;
  }

  // ── Hallazgos accionables ──────────────────────────────────────────────────
  const findings: Finding[] = [];
  const ex = (arr: EnrichedQuery[], n = 3) => arr.slice(0, n).map((e) => e.query!).filter(Boolean);

  if (intel.ctrFixes.length > 0 && potentialClicks.ctrFix >= 3) {
    findings.push({
      id: "ctr-fix",
      severity: "opportunity",
      title: "Rankeas en página 1 pero pierdes el clic",
      metric: `${intel.ctrFixes.length} queries · ~${potentialClicks.ctrFix.toLocaleString()} clics recuperables`,
      meaning: "Estas búsquedas ya rankean en el top 10, pero el CTR está muy por debajo de lo normal para esa posición. La página existe; el título y la meta description no convencen.",
      action: "Reescribir títulos y meta descriptions de estas páginas (no hace falta contenido nuevo).",
      why: `El tráfico ya está ahí: solo recuperando el CTR esperado para su posición se suman ~${potentialClicks.ctrFix.toLocaleString()} clics. Es la ganancia más barata y rápida.`,
      owner: "Alejandra",
      examples: ex(intel.ctrFixes),
    });
  }

  if (intel.striking.length > 0) {
    const strikingImpr = intel.striking.reduce((s, e) => s + e.impressions, 0);
    findings.push({
      id: "striking",
      severity: "opportunity",
      title: "Striking distance: a un empujón de página 1",
      metric: `${intel.striking.length} queries · ${strikingImpr.toLocaleString()} impresiones · ~${potentialClicks.striking.toLocaleString()} clics potenciales`,
      meaning: "Búsquedas que ya rankean en posición 5-20. Están cerca; un refuerzo de la página existente o una pieza enfocada las sube rápido.",
      action: "Reforzar la página que ya rankea (enlaces internos, profundidad, frescura) o escribir una pieza dedicada al cluster.",
      why: `Subir de pos ~10 a pos ~5 multiplica el CTR varias veces. Estas ${intel.striking.length} queries son el mejor retorno por esfuerzo en contenido.`,
      owner: "Walter + Alejandra",
      examples: ex(intel.striking),
    });
  }

  if (intel.untapped.length > 0) {
    const untappedImpr = intel.untapped.reduce((s, e) => s + e.impressions, 0);
    findings.push({
      id: "untapped",
      severity: "opportunity",
      title: "Demanda sin contenido que la capture",
      metric: `${intel.untapped.length} queries · ${untappedImpr.toLocaleString()} impresiones · casi 0 clics`,
      meaning: "Mucha gente busca esto y nos vio aparecer, pero casi nadie hizo clic: el contenido es demasiado delgado o no existe para esa intención exacta.",
      action: "Escribir piezas nuevas dedicadas a estas queries (este es el input directo para la cola de Drafts).",
      why: "Es demanda confirmada por datos, no una corazonada. Cada pieza ataca una necesidad que el mercado ya está buscando activamente.",
      owner: "Walter",
      examples: ex(intel.untapped),
    });
  }

  if (intel.comparisons.length > 0) {
    const compImpr = intel.comparisons.reduce((s, e) => s + e.impressions, 0);
    findings.push({
      id: "comparisons",
      severity: "opportunity",
      title: "Búsquedas de comparación con competidores",
      metric: `${intel.comparisons.length} queries · ${compImpr.toLocaleString()} impresiones`,
      meaning: "Gente comparando Leasey.AI (o la categoría) contra competidores. Es intención de decisión: están a punto de elegir.",
      action: 'Escribir/fortalecer comparaciones honestas tipo "Leasey.AI vs X" (dónde gana cada uno).',
      why: "Es el tráfico más cercano a la conversión. Quien busca 'X vs Y' ya quiere comprar; capturarlo influye directo en pipeline.",
      owner: "Walter",
      examples: ex(intel.comparisons),
    });
  }

  if (intel.questions.length > 0) {
    findings.push({
      id: "questions",
      severity: "opportunity",
      title: "Preguntas (oportunidad AEO)",
      metric: `${intel.questions.length} queries tipo pregunta`,
      meaning: "Búsquedas en forma de pregunta (how/what/why…). Son ideales para responder en las primeras dos líneas y ganar citaciones en IA y featured snippets.",
      action: "Escribir explainers/how-to que respondan la pregunta directo en el primer párrafo (patrón AEO).",
      why: "Los motores de IA y los snippets premian la respuesta directa. Posiciona la marca como la fuente, no solo un resultado más.",
      owner: "Walter",
      examples: ex(intel.questions),
    });
  }

  // Tendencias: lo que sube (duplicar apuesta) y lo que baja (riesgo).
  const realRising = trends.rising.filter((r) => r.imprDelta > 0).slice(0, 3);
  const realDeclining = trends.declining.filter((r) => r.imprDelta < 0).slice(0, 3);
  if (realRising.length > 0) {
    findings.push({
      id: "rising",
      severity: "win",
      title: "Temas en alza — dobla la apuesta",
      metric: `${realRising.map((r) => `"${r.query}" +${r.imprDelta.toLocaleString()}`).join(" · ")}`,
      meaning: "Estas búsquedas crecieron en impresiones frente al período anterior. El interés del mercado está subiendo justo aquí.",
      action: "Crear contenido de seguimiento alrededor de estos temas mientras el momentum está activo.",
      why: "Montarse en una tendencia al alza rinde mucho más que pelear temas estancados. El timing es la ventaja.",
      owner: "Walter",
      examples: realRising.map((r) => r.query!).filter(Boolean),
    });
  }
  if (realDeclining.length > 0) {
    findings.push({
      id: "declining",
      severity: "watch",
      title: "Temas a la baja — revisar",
      metric: `${realDeclining.map((r) => `"${r.query}" ${r.imprDelta.toLocaleString()}`).join(" · ")}`,
      meaning: "Búsquedas que perdieron impresiones frente al período anterior. Puede ser estacionalidad, un competidor que nos pasó, o contenido que envejeció.",
      action: "Revisar si la página necesita refresco/actualización; confirmar que no es solo estacionalidad antes de invertir.",
      why: "Una caída sostenida en una query que importa erosiona tráfico de forma compuesta. Mejor detectarla temprano.",
      owner: "Walter + Alejandra",
      examples: realDeclining.map((r) => r.query!).filter(Boolean),
    });
  }

  // Orden: oportunidades y riesgos primero, wins/watch al final.
  const sevRank: Record<Severity, number> = { risk: 0, opportunity: 1, win: 2, watch: 3 };
  findings.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

  return {
    connected: true,
    days,
    headline: {
      clicks: totalClicks,
      impressions: totalImpr,
      ctr,
      avgPosition,
      captureRate,
      summary,
      verdict,
    },
    potentialClicks,
    findings,
  };
}
