#!/usr/bin/env python3
"""
07_export.py — Wire pipeline output into site/src/data.jsx
=============================================================
Reads all JSON outputs from the pipeline and generates a new data.jsx
that replaces synthetic data with real pipeline data.

Follows the same pattern as Black Box: embed data as JS objects,
expose via Object.assign(window, {...}).

Output: site/src/data.jsx (overwrites existing synthetic data)
"""

import json
from pathlib import Path

PIPELINE_DIR = Path(__file__).parent
OUTPUT_DIR = PIPELINE_DIR / "output"
SITE_DATA = PIPELINE_DIR.parent / "site" / "src" / "data.jsx"

REQUIRED_FILES = [
    "consolidation_hhi.json",
    "market_concentration.json",
    "transfers.json",
    "news_deserts.json",
    "sinclair_footprint.json",
    "regulatory_timeline.json",
]


def load_json(filename):
    path = OUTPUT_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing: {path}. Run the pipeline scripts first.")
    with open(path) as f:
        return json.load(f)


def json_to_js(obj, indent=2):
    """Convert a Python object to a JS-compatible literal string."""
    return json.dumps(obj, indent=indent)


def build_data_jsx():
    """Build the complete data.jsx file from pipeline outputs."""

    # Load all pipeline data
    consolidation = load_json("consolidation_hhi.json")
    markets = load_json("market_concentration.json")
    transfers = load_json("transfers.json")
    news_deserts = load_json("news_deserts.json")
    sinclair = load_json("sinclair_footprint.json")
    regulatory = load_json("regulatory_timeline.json")

    # Build ownership timeline from consolidation data
    ownership_data = consolidation["data"]
    market_data = markets["data"]
    transfer_data = transfers["data"]
    reg_data = regulatory["data"]
    sinclair_data = sinclair

    # Build the SPECTRUM_STATS from real data
    y1996 = next(r for r in ownership_data if r["year"] == 1996)
    y2024 = next(r for r in ownership_data if r["year"] == 2024)
    sinclair_summary = sinclair["summary"]

    spectrum_stats = [
        {
            "label": "RADIO STATION OWNERS \u00b7 1996",
            "value": f"{y1996['owners']:,}",
            "sub": "Peak ownership diversity before Telecom Act",
        },
        {
            "label": "RADIO STATION OWNERS \u00b7 2024",
            "value": f"~{y2024['owners']:,}",
            "sub": "After three decades of consolidation",
        },
        {
            "label": "IHEARTMEDIA STATIONS",
            "value": "860+",
            "sub": "Largest radio company in America",
        },
        {
            "label": "SINCLAIR TV REACH",
            "value": f"{sinclair_summary['household_reach_pct']}%",
            "sub": f"Percentage of US households reached ({sinclair_summary['total_stations']} stations)",
        },
        {
            "label": "COUNTIES WITH NO LOCAL NEWS",
            "value": f"{news_deserts['summary']['news_desert_counties']}+",
            "sub": "News deserts across the country",
        },
        {
            "label": "PUBLIC INTEREST OBLIGATION",
            "value": "Still required",
            "sub": "FCC mandate largely unenforced since 1987",
        },
    ]

    # Build the META object
    meta = {
        "pipeline_version": "1.0.0",
        "data_sources": {
            "ownership": consolidation["sources"],
            "markets": markets["sources"],
            "transfers": transfers["sources"],
            "news_deserts": news_deserts["sources"],
            "sinclair": sinclair["sources"],
            "regulatory": regulatory["sources"],
        },
        "methodology": {
            "consolidation": consolidation["methodology"],
            "markets": markets["methodology"],
            "transfers": transfers["methodology"],
            "news_deserts": news_deserts["methodology"],
            "regulatory": regulatory["methodology"],
        },
        "confidence": {
            "ownership_counts": "HIGH - FCC records and published research",
            "hhi_national": "HIGH - computed from published ownership distributions",
            "market_concentration": "HIGH - BIA/Kelsey and FCC studies",
            "transfers": "HIGH - SEC filings and FCC records",
            "news_deserts": "HIGH - UNC Hussman School research",
            "sinclair_footprint": "HIGH - SEC filings and FCC database",
            "regulatory_timeline": "HIGH - statutory and regulatory record",
        },
    }

    # Build the transfer log in the format the frontend expects
    # The frontend expects: date, callSign, market, fromOwner, toOwner, price, year
    frontend_transfers = []
    for t in transfer_data:
        call_signs = t.get("call_signs", [])
        cs = call_signs[0] if call_signs else t.get("transaction", "")[:20]
        frontend_transfers.append({
            "date": t["date"],
            "callSign": cs,
            "market": t["market"],
            "fromOwner": t["from_owner"],
            "toOwner": t["to_owner"],
            "price": t["price"],
            "year": t["year"],
            "transaction": t.get("transaction", ""),
            "type": t.get("type", "acquisition"),
            "note": t.get("note"),
        })

    # Build regulatory timeline in the format the frontend expects
    frontend_regulatory = []
    for r in reg_data:
        frontend_regulatory.append({
            "year": r["year"],
            "label": r["label"],
            "desc": r["desc"],
            "type": r["type"],
        })

    # Build noteForYear from consolidation data notes and regulatory events
    notes_by_year = {}
    for row in ownership_data:
        if row.get("note"):
            notes_by_year[row["year"]] = row["note"]
    # Add regulatory event descriptions
    for r in reg_data:
        if r["year"] not in notes_by_year:
            notes_by_year[r["year"]] = f"{r['label']}: {r['desc'][:100]}"

    # Generate the JS file
    jsx_lines = []
    jsx_lines.append("// Data layer for Dead Air")
    jsx_lines.append("// Generated by pipeline/07_export.py from real research data.")
    jsx_lines.append("// Sources cited in META.data_sources below.")
    jsx_lines.append("")

    # Color utilities (keep from original)
    jsx_lines.append("// ------- Consolidation color scale (blue -> amber -> red) ----------")
    jsx_lines.append("""function consolidationColor(v) {
  const clamped = Math.max(0, Math.min(1, v));
  if (clamped < 0.5) {
    const t = clamped / 0.5;
    return lerpColor('#2E86AB', '#E8A838', t);
  }
  const t = (clamped - 0.5) / 0.5;
  return lerpColor('#E8A838', '#C0392B', t);
}""")
    jsx_lines.append("")
    jsx_lines.append("""function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa>>16)&255, ag = (pa>>8)&255, ab = pa&255;
  const br = (pb>>16)&255, bg = (pb>>8)&255, bb = pb&255;
  const r = Math.round(ar+(br-ar)*t), g = Math.round(ag+(bg-ag)*t), b2 = Math.round(ab+(bb-ab)*t);
  return `rgb(${r},${g},${b2})`;
}""")
    jsx_lines.append("")

    # Format helpers (keep from original)
    jsx_lines.append("// ------- Format helpers ----------")
    jsx_lines.append("""function formatPrice(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n;
}""")
    jsx_lines.append("")
    jsx_lines.append("""function formatNumber(n) {
  return n.toLocaleString('en-US');
}""")
    jsx_lines.append("")

    # Ownership timeline (real data, not PRNG-generated)
    jsx_lines.append("// ------- Ownership Timeline (1934-2024) — from published research ----------")
    jsx_lines.append(f"const ownershipTimeline = {json_to_js(ownership_data)};")
    jsx_lines.append("")

    # Spectrum stats
    jsx_lines.append("// ------- Spectrum Stats ----------")
    jsx_lines.append(f"const SPECTRUM_STATS = {json_to_js(spectrum_stats)};")
    jsx_lines.append("")

    # Transfer log
    jsx_lines.append("// ------- Transfer Log (documented FCC transactions) ----------")
    jsx_lines.append(f"const transferLog = {json_to_js(frontend_transfers)};")
    jsx_lines.append("")

    # Market concentration
    jsx_lines.append("// ------- Market Concentration (50 US markets) ----------")
    jsx_lines.append(f"const marketConcentration = {json_to_js(market_data)};")
    jsx_lines.append("")

    # Regulatory timeline
    jsx_lines.append("// ------- Regulatory Timeline ----------")
    jsx_lines.append(f"const regulatoryTimeline = {json_to_js(frontend_regulatory)};")
    jsx_lines.append("")

    # Sinclair data (new addition for the frontend)
    jsx_lines.append("// ------- Sinclair Footprint ----------")
    jsx_lines.append(f"const sinclairFootprint = {json_to_js(sinclair_data)};")
    jsx_lines.append("")

    # News desert data (new addition for the frontend)
    jsx_lines.append("// ------- News Deserts ----------")
    news_desert_frontend = {
        "summary": news_deserts["summary"],
        "newsroom_employment": news_deserts["newsroom_employment"],
        "state_news_deserts": news_deserts["state_news_deserts"],
        "democratic_impact": news_deserts["democratic_impact"],
    }
    jsx_lines.append(f"const newsDeserts = {json_to_js(news_desert_frontend)};")
    jsx_lines.append("")

    # META
    jsx_lines.append("// ------- Pipeline metadata ----------")
    jsx_lines.append(f"const META = {json_to_js(meta)};")
    jsx_lines.append("")

    # noteForYear function
    jsx_lines.append("// ------- Note for Year ----------")
    jsx_lines.append("function noteForYear(year) {")
    jsx_lines.append(f"  const notes = {json_to_js(notes_by_year)};")
    jsx_lines.append("  if (notes[year]) return notes[year];")
    jsx_lines.append("  if (year >= 1996 && year <= 2002) return 'Peak consolidation era. Thousands of stations change hands.';")
    jsx_lines.append("  return null;")
    jsx_lines.append("}")
    jsx_lines.append("")

    # Expose to window
    jsx_lines.append("// ------- Expose to window ----------")
    jsx_lines.append("""Object.assign(window, {
  consolidationColor, lerpColor,
  formatPrice, formatNumber,
  ownershipTimeline, SPECTRUM_STATS,
  transferLog, marketConcentration,
  regulatoryTimeline, noteForYear,
  sinclairFootprint, newsDeserts, META,
});""")
    jsx_lines.append("")

    return "\n".join(jsx_lines)


def main():
    print("=" * 60)
    print("One Hundred Years -- Dead Air")
    print("Stage 07: Export to data.jsx")
    print("=" * 60)

    # Check all required files exist
    print("\n  Checking pipeline outputs...")
    missing = []
    for f in REQUIRED_FILES:
        path = OUTPUT_DIR / f
        if path.exists():
            size = path.stat().st_size
            print(f"    [ok] {f} ({size:,} bytes)")
        else:
            print(f"    [!!] {f} MISSING")
            missing.append(f)

    if missing:
        print(f"\n  ERROR: {len(missing)} file(s) missing. Run pipeline scripts first.")
        print(f"  Missing: {', '.join(missing)}")
        return

    # Build data.jsx
    print("\n  Building data.jsx...")
    jsx_content = build_data_jsx()

    # Write to site/src/data.jsx
    SITE_DATA.parent.mkdir(parents=True, exist_ok=True)
    with open(SITE_DATA, "w") as f:
        f.write(jsx_content)

    print(f"  [ok] Written: {SITE_DATA}")
    print(f"       {len(jsx_content):,} bytes")
    print(f"       {jsx_content.count(chr(10)):,} lines")

    # Verify globals
    expected_globals = [
        "ownershipTimeline", "transferLog", "marketConcentration",
        "regulatoryTimeline", "SPECTRUM_STATS", "META",
        "sinclairFootprint", "newsDeserts",
    ]
    for g in expected_globals:
        if g in jsx_content:
            print(f"    [ok] {g}")
        else:
            print(f"    [!!] {g} NOT FOUND in output")

    print("\n" + "=" * 60)
    print("Export complete. Frontend data updated.")
    print("=" * 60)


if __name__ == "__main__":
    main()
