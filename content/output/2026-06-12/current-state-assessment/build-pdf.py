"""Build the Current State Assessment PDF from the 10 markdown sections."""
from __future__ import annotations
import re
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether
)
from reportlab.platypus.tableofcontents import TableOfContents

# ---------------------------------------------------------------------------- #
# Leasey palette                                                                #
# ---------------------------------------------------------------------------- #
BLUE = HexColor("#1f6feb")
TEAL = HexColor("#0ea5a4")
INK = HexColor("#0f1b2d")
SLATE = HexColor("#5b6b7f")
LINE = HexColor("#e6ebf2")
BG_CELL = HexColor("#f6f8fb")

HERE = Path(__file__).parent
OUT = HERE / "Leasey-Content-Assessment-Preliminary-2026-06-12.pdf"

# Section files in order, with display titles
SECTIONS = [
    ("01-executive-summary.md", "1. Executive Summary"),
    ("02-how-content-has-been.md", "2. How content has been"),
    ("03-how-content-should-be.md", "3. How content should be"),
    ("04-distribution-today-and-tomorrow.md", "4. Distribution today, and where it needs to go"),
    ("05-search-demand-at-a-glance.md", "5. Search demand at a glance"),
    ("06-aeo-state.md", "6. AEO: where Leasey shows up in AI search"),
    ("07-open-questions-for-the-founders.md", "7. Open questions for the founders"),
    ("08-roadmap-to-end-of-june.md", "8. Roadmap to end of June"),
]

# ---------------------------------------------------------------------------- #
# Styles                                                                        #
# ---------------------------------------------------------------------------- #
BASE = getSampleStyleSheet()

S = {
    "cover_title": ParagraphStyle(
        "cover_title", parent=BASE["Title"], fontName="Helvetica-Bold",
        fontSize=28, leading=34, textColor=INK, alignment=TA_CENTER, spaceAfter=10,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub", parent=BASE["Normal"], fontName="Helvetica",
        fontSize=14, leading=20, textColor=BLUE, alignment=TA_CENTER, spaceAfter=40,
    ),
    "cover_meta": ParagraphStyle(
        "cover_meta", parent=BASE["Normal"], fontName="Helvetica",
        fontSize=11, leading=16, textColor=SLATE, alignment=TA_CENTER,
    ),
    "h1": ParagraphStyle(
        "h1", parent=BASE["Heading1"], fontName="Helvetica-Bold",
        fontSize=20, leading=26, textColor=INK, spaceBefore=0, spaceAfter=12,
        keepWithNext=1,
    ),
    "h2": ParagraphStyle(
        "h2", parent=BASE["Heading2"], fontName="Helvetica-Bold",
        fontSize=14, leading=20, textColor=BLUE, spaceBefore=14, spaceAfter=6,
        keepWithNext=1,
    ),
    "h3": ParagraphStyle(
        "h3", parent=BASE["Heading3"], fontName="Helvetica-Bold",
        fontSize=12, leading=16, textColor=TEAL, spaceBefore=10, spaceAfter=4,
        keepWithNext=1,
    ),
    "body": ParagraphStyle(
        "body", parent=BASE["Normal"], fontName="Helvetica",
        fontSize=10, leading=14, textColor=INK, spaceAfter=6,
    ),
    "li": ParagraphStyle(
        "li", parent=BASE["Normal"], fontName="Helvetica",
        fontSize=10, leading=14, textColor=INK, spaceAfter=3, leftIndent=14, bulletIndent=2,
    ),
    "code": ParagraphStyle(
        "code", parent=BASE["Normal"], fontName="Courier",
        fontSize=8.5, leading=12, textColor=INK, backColor=BG_CELL,
        borderColor=LINE, borderWidth=0.5, borderPadding=6, spaceAfter=6,
    ),
    "toc_l1": ParagraphStyle(
        "toc_l1", parent=BASE["Normal"], fontName="Helvetica-Bold",
        fontSize=12, leading=18, textColor=INK, leftIndent=0, spaceAfter=2,
    ),
    "blockquote": ParagraphStyle(
        "blockquote", parent=BASE["Normal"], fontName="Helvetica-Oblique",
        fontSize=10, leading=14, textColor=SLATE, leftIndent=18, spaceAfter=6,
    ),
}


def inline_md(text: str) -> str:
    """Convert inline markdown to ReportLab paragraph markup (basic)."""
    # Escape XML special chars first
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # Bold **x**
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    # Italic *x* / _x_
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", text)
    # Inline code `x`
    text = re.sub(r"`([^`]+?)`", r'<font face="Courier" size="9">\1</font>', text)
    # Links [text](url)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
                  r'<font color="#1f6feb"><u>\1</u></font>', text)
    return text


def parse_markdown(md_text: str) -> list:
    """Convert markdown lines to a list of reportlab flowables."""
    flow = []
    lines = md_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # H1 (section title) - skip, we add it in the build loop
        if stripped.startswith("# ") and i == 0:
            i += 1
            continue

        # H2
        if stripped.startswith("## "):
            flow.append(Paragraph(inline_md(stripped[3:]), S["h2"]))
            i += 1
            continue

        # H3
        if stripped.startswith("### "):
            flow.append(Paragraph(inline_md(stripped[4:]), S["h3"]))
            i += 1
            continue

        # Code block ```
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            code = "\n".join(code_lines)
            code = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            code = code.replace(" ", "&nbsp;").replace("\n", "<br/>")
            flow.append(Paragraph(code, S["code"]))
            i += 1
            continue

        # Markdown table: line starts with | and next line is | --- |
        if stripped.startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|[\s\-:|]+\|\s*$", lines[i + 1]):
            tbl_rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                if re.match(r"^\s*\|[\s\-:|]+\|\s*$", lines[i]):
                    i += 1
                    continue
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                tbl_rows.append(cells)
                i += 1
            if tbl_rows:
                flow.append(_make_table(tbl_rows))
            continue

        # Bullet list
        if re.match(r"^\s*[-*]\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*[-*]\s+", lines[i]):
                content = re.sub(r"^\s*[-*]\s+", "", lines[i])
                items.append(Paragraph("&#8226; " + inline_md(content), S["li"]))
                i += 1
            flow.extend(items)
            flow.append(Spacer(1, 4))
            continue

        # Numbered list
        if re.match(r"^\s*\d+\.\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*\d+\.\s+", lines[i]):
                m = re.match(r"^\s*(\d+)\.\s+(.*)", lines[i])
                num, content = m.group(1), m.group(2)
                items.append(Paragraph(f"<b>{num}.</b> {inline_md(content)}", S["li"]))
                i += 1
            flow.extend(items)
            flow.append(Spacer(1, 4))
            continue

        # Blockquote
        if stripped.startswith(">"):
            content = stripped[1:].strip()
            flow.append(Paragraph(inline_md(content), S["blockquote"]))
            i += 1
            continue

        # Empty line
        if not stripped:
            i += 1
            continue

        # Paragraph (collect until empty line or block element)
        para = [line]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if not nxt:
                break
            if nxt.startswith(("#", "-", "*", ">", "```", "|")) or re.match(r"^\s*\d+\.\s+", lines[i]):
                break
            para.append(lines[i])
            i += 1
        joined = " ".join(p.strip() for p in para)
        flow.append(Paragraph(inline_md(joined), S["body"]))

    return flow


def _make_table(rows: list[list[str]]) -> Table:
    """Build a styled Table from markdown rows. First row is header."""
    # Wrap each cell content as a Paragraph so it word-wraps
    cell_style = ParagraphStyle(
        "cell", parent=BASE["Normal"], fontName="Helvetica",
        fontSize=8.5, leading=11, textColor=INK,
    )
    header_style = ParagraphStyle(
        "cell_h", parent=cell_style, fontName="Helvetica-Bold", textColor=white,
    )
    data = []
    for r, row in enumerate(rows):
        rendered = []
        for c in row:
            style = header_style if r == 0 else cell_style
            rendered.append(Paragraph(inline_md(c), style))
        data.append(rendered)

    n_cols = max(len(r) for r in rows) if rows else 1
    # Equal column widths within 6.5" content (letter page minus margins)
    page_w = 6.5 * inch
    col_w = page_w / n_cols
    tbl = Table(data, colWidths=[col_w] * n_cols, repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, BG_CELL]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE),
    ]))
    return tbl


# ---------------------------------------------------------------------------- #
# Page template with footer page numbers and header band                        #
# ---------------------------------------------------------------------------- #
def _on_page(canvas, doc):
    canvas.saveState()
    page_num = canvas.getPageNumber()
    # Skip footer on cover (page 1)
    if page_num > 1:
        # Footer rule
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.4)
        canvas.line(0.75 * inch, 0.55 * inch, 7.75 * inch, 0.55 * inch)
        # Footer text
        canvas.setFont("Helvetica", 8.5)
        canvas.setFillColor(SLATE)
        canvas.drawString(0.75 * inch, 0.38 * inch, "Leasey.AI - Content Assessment - Preliminary - Jun 12, 2026 - Walter Von Roestel")
        canvas.drawRightString(7.75 * inch, 0.38 * inch, f"Page {page_num}")
    canvas.restoreState()


def _on_cover(canvas, doc):
    """Cover decoration: top accent bar."""
    canvas.saveState()
    canvas.setFillColor(BLUE)
    canvas.rect(0, 10.5 * inch, 8.5 * inch, 0.5 * inch, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.rect(0, 10.40 * inch, 8.5 * inch, 0.1 * inch, stroke=0, fill=1)
    canvas.restoreState()


# ---------------------------------------------------------------------------- #
# Build                                                                         #
# ---------------------------------------------------------------------------- #
def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="Leasey.AI - Current State Assessment",
        author="Walter Von Roestel and Alejandra Correa",
    )

    cover_frame = Frame(0.75 * inch, 0.75 * inch, 7 * inch, 9.5 * inch, id="cover")
    body_frame = Frame(0.75 * inch, 0.75 * inch, 7 * inch, 9.5 * inch, id="body")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=cover_frame, onPage=_on_cover),
        PageTemplate(id="body", frames=body_frame, onPage=_on_page),
    ])

    story = []

    # ---- Cover page ---- #
    story.append(Spacer(1, 2.4 * inch))
    story.append(Paragraph("LEASEY<font color='#1f6feb'>.AI</font>", S["cover_title"]))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Current State Assessment", ParagraphStyle(
        "cstit", parent=S["cover_title"], fontSize=22, textColor=BLUE,
    )))
    story.append(Paragraph("Content", S["cover_sub"]))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("PRELIMINARY  -  June 12, 2026", ParagraphStyle(
        "label", parent=S["cover_meta"], fontName="Helvetica-Bold", fontSize=11, textColor=TEAL,
    )))
    story.append(Spacer(1, 0.6 * inch))
    story.append(Paragraph("For", S["cover_meta"]))
    story.append(Paragraph("<b>Juan Leal</b>, CEO and CPO", S["cover_meta"]))
    story.append(Paragraph("<b>Carlos Leal</b>, COO", S["cover_meta"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("By", S["cover_meta"]))
    story.append(Paragraph("<b>Walter Von Roestel</b>, Content Lead", S["cover_meta"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ---- Table of Contents ---- #
    story.append(Paragraph("Table of Contents", S["h1"]))
    story.append(Spacer(1, 6))
    for _, title in SECTIONS:
        story.append(Paragraph(title, S["toc_l1"]))
    story.append(PageBreak())

    # ---- Sections ---- #
    for idx, (filename, title) in enumerate(SECTIONS):
        path = HERE / filename
        md = path.read_text(encoding="utf-8")
        story.append(Paragraph(title, S["h1"]))
        story.append(Spacer(1, 4))
        story.extend(parse_markdown(md))
        if idx < len(SECTIONS) - 1:
            story.append(PageBreak())

    doc.build(story)
    print(f"Wrote {OUT}")


# Late import to avoid circular issues
from reportlab.platypus.doctemplate import NextPageTemplate  # noqa: E402

if __name__ == "__main__":
    build()
