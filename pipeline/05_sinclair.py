#!/usr/bin/env python3
"""
05_sinclair.py — Sinclair Broadcast Group Must-Run Footprint
==============================================================
Sinclair station list and must-run segment data.

Sources:
  - Sinclair Broadcast Group SEC filings (10-K annual reports)
  - Sinclair Broadcast Group website (station list)
  - FCC license database (public record)
  - Deadspin, "How America's Largest Local TV Owner Turned Its News
    Anchors Into Soldiers In Trump's War On The Media" (2018)
  - Timothy Burke / Deadspin synchronized script compilation (2018)
  - Columbia Journalism Review Sinclair coverage (2017-2024)
  - Published analyses of Boris Epshteyn must-run segments

Key facts (publicly documented):
  - Sinclair owns or operates ~185 TV stations as of 2024
  - Reaches approximately 40% of US TV households
  - Must-run segments: centrally produced content inserted into local newscasts
  - Types: "Bottom Line with Boris Epshteyn", "Behind the Headlines",
    "Terrorism Alert Desk", "Full Measure with Sharyl Attkisson"
  - The 2018 "promo script" incident: anchors at dozens of stations
    read identical scripts attacking "biased and false news"

Output: pipeline/output/sinclair_footprint.json
"""

import json
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"

# Sinclair TV stations — representative sample of publicly known stations
# Source: Sinclair SEC filings, FCC license database, station websites
# As of 2024: ~185 stations in ~86 markets
# This is a curated list of notable/documented stations; not exhaustive
SINCLAIR_STATIONS = [
    # Format: call_sign, market, state, network_affiliation, acquired_year
    # Major market stations
    {"call_sign": "WJLA-TV", "market": "Washington DC", "state": "DC", "network": "ABC", "acquired": 2014,
     "lat": 38.91, "lon": -77.04, "note": "Acquired from Allbritton. $985M deal."},
    {"call_sign": "WJZ-TV", "market": "Baltimore", "state": "MD", "network": "CBS", "acquired": 2017,
     "lat": 39.29, "lon": -76.61, "note": "Sinclair headquarters market"},
    {"call_sign": "KOMO-TV", "market": "Seattle", "state": "WA", "network": "ABC", "acquired": 2013,
     "lat": 47.61, "lon": -122.33, "note": "Acquired from Fisher Communications"},
    {"call_sign": "KATU-TV", "market": "Portland", "state": "OR", "network": "ABC", "acquired": 2013,
     "lat": 45.52, "lon": -122.68, "note": "Acquired from Fisher Communications"},
    {"call_sign": "WBFF-TV", "market": "Baltimore", "state": "MD", "network": "FOX", "acquired": 1991,
     "lat": 39.29, "lon": -76.61, "note": "Original Sinclair flagship station"},
    {"call_sign": "WPGH-TV", "market": "Pittsburgh", "state": "PA", "network": "FOX", "acquired": 2014,
     "lat": 40.44, "lon": -80.00, "note": None},
    {"call_sign": "WTTE-TV", "market": "Columbus", "state": "OH", "network": "FOX", "acquired": 1996,
     "lat": 39.96, "lon": -83.00, "note": "Acquired from Heritage Communications"},
    {"call_sign": "WSYX-TV", "market": "Columbus", "state": "OH", "network": "ABC", "acquired": 1996,
     "lat": 39.96, "lon": -83.00, "note": None},
    {"call_sign": "WDKY-TV", "market": "Lexington", "state": "KY", "network": "FOX", "acquired": 1997,
     "lat": 38.04, "lon": -84.50, "note": None},
    {"call_sign": "KABB-TV", "market": "San Antonio", "state": "TX", "network": "FOX", "acquired": 1998,
     "lat": 29.42, "lon": -98.49, "note": "Acquired from Sullivan Broadcasting"},
    {"call_sign": "WSTR-TV", "market": "Cincinnati", "state": "OH", "network": "MyNetwork", "acquired": 1998,
     "lat": 39.10, "lon": -84.51, "note": None},
    {"call_sign": "WTVZ-TV", "market": "Norfolk", "state": "VA", "network": "MyNetwork", "acquired": 2001,
     "lat": 36.85, "lon": -76.29, "note": None},
    {"call_sign": "WLFL-TV", "market": "Raleigh", "state": "NC", "network": "CW", "acquired": 2002,
     "lat": 35.78, "lon": -78.64, "note": None},
    {"call_sign": "KOCB-TV", "market": "Oklahoma City", "state": "OK", "network": "CW", "acquired": 1997,
     "lat": 35.47, "lon": -97.52, "note": None},
    {"call_sign": "WZTV-TV", "market": "Nashville", "state": "TN", "network": "FOX", "acquired": 2017,
     "lat": 36.16, "lon": -86.78, "note": None},
    {"call_sign": "WCHS-TV", "market": "Charleston WV", "state": "WV", "network": "ABC", "acquired": 1998,
     "lat": 38.35, "lon": -81.63, "note": None},
    {"call_sign": "WVAH-TV", "market": "Charleston WV", "state": "WV", "network": "FOX", "acquired": 1998,
     "lat": 38.35, "lon": -81.63, "note": None},
    {"call_sign": "WXLV-TV", "market": "Greensboro", "state": "NC", "network": "ABC", "acquired": 1997,
     "lat": 36.07, "lon": -79.79, "note": None},
    {"call_sign": "WTVH-TV", "market": "Syracuse", "state": "NY", "network": "CBS", "acquired": 2014,
     "lat": 43.05, "lon": -76.15, "note": None},
    {"call_sign": "WGME-TV", "market": "Portland ME", "state": "ME", "network": "CBS", "acquired": 2013,
     "lat": 43.66, "lon": -70.26, "note": None},
    {"call_sign": "KUTV-TV", "market": "Salt Lake City", "state": "UT", "network": "CBS", "acquired": 2017,
     "lat": 40.76, "lon": -111.89, "note": None},
    {"call_sign": "KATV-TV", "market": "Little Rock", "state": "AR", "network": "ABC", "acquired": 2014,
     "lat": 34.75, "lon": -92.29, "note": "Acquired from Allbritton"},
    {"call_sign": "WHTM-TV", "market": "Harrisburg", "state": "PA", "network": "ABC", "acquired": 2014,
     "lat": 40.27, "lon": -76.88, "note": "Acquired from Allbritton"},
    {"call_sign": "KDSM-TV", "market": "Des Moines", "state": "IA", "network": "FOX", "acquired": 2012,
     "lat": 41.59, "lon": -93.62, "note": None},
    {"call_sign": "WEAR-TV", "market": "Pensacola", "state": "FL", "network": "ABC", "acquired": 2012,
     "lat": 30.44, "lon": -87.22, "note": None},
    {"call_sign": "WKRC-TV", "market": "Cincinnati", "state": "OH", "network": "CBS", "acquired": 2017,
     "lat": 39.10, "lon": -84.51, "note": None},
    {"call_sign": "WDTN-TV", "market": "Dayton", "state": "OH", "network": "NBC", "acquired": 2017,
     "lat": 39.76, "lon": -84.19, "note": None},
    {"call_sign": "WWMT-TV", "market": "Kalamazoo", "state": "MI", "network": "CBS", "acquired": 2017,
     "lat": 42.29, "lon": -85.59, "note": None},
    {"call_sign": "WTVG-TV", "market": "Toledo", "state": "OH", "network": "ABC", "acquired": 2017,
     "lat": 41.65, "lon": -83.54, "note": None},
]

# Must-run segment types
# Source: CJR, Deadspin, published media criticism
MUST_RUN_SEGMENTS = [
    {
        "name": "Bottom Line with Boris Epshteyn",
        "type": "commentary",
        "duration_seconds": 90,
        "frequency": "daily",
        "years_active": "2017-present",
        "description": (
            "Daily political commentary segment produced centrally at Sinclair headquarters "
            "in Hunt Valley, Maryland. Inserted into local newscasts at ~185 stations. "
            "Boris Epshteyn is a former Trump campaign advisor and brief White House aide."
        ),
        "source": "CJR, Politico, published media criticism",
    },
    {
        "name": "Behind the Headlines with Mark Hyman",
        "type": "commentary",
        "duration_seconds": 60,
        "frequency": "weekly",
        "years_active": "2001-2017",
        "description": (
            "Weekly conservative commentary segment aired during local newscasts. "
            "Mark Hyman was Sinclair's VP of corporate relations."
        ),
        "source": "Published media criticism, FCC complaint records",
    },
    {
        "name": "Terrorism Alert Desk",
        "type": "news_segment",
        "duration_seconds": 120,
        "frequency": "daily",
        "years_active": "2017-2019",
        "description": (
            "Daily segment on terrorism threats, produced centrally and inserted into "
            "local newscasts. Critics noted it prioritized fear over local relevance."
        ),
        "source": "CJR, Deadspin",
    },
    {
        "name": "Full Measure with Sharyl Attkisson",
        "type": "investigative",
        "duration_seconds": 1800,
        "frequency": "weekly",
        "years_active": "2015-present",
        "description": (
            "Weekly Sunday investigative news program produced by Sinclair. "
            "Airs on Sinclair stations nationally."
        ),
        "source": "Sinclair Broadcast Group",
    },
    {
        "name": "Sinclair promotional script (2018)",
        "type": "promotional",
        "duration_seconds": 90,
        "frequency": "one-time",
        "years_active": "2018",
        "description": (
            "In March 2018, anchors at dozens of Sinclair stations read identical scripts "
            "warning viewers about 'biased and false news.' Video compilation by Deadspin's "
            "Timothy Burke showed the synchronized delivery across markets. The incident "
            "drew widespread criticism and demonstrated centralized editorial control."
        ),
        "source": "Deadspin (Timothy Burke), widespread news coverage",
    },
]

# Sinclair footprint summary
FOOTPRINT_SUMMARY = {
    "total_stations": 185,
    "total_markets": 86,
    "household_reach_pct": 40,
    "headquarters": "Hunt Valley, Maryland",
    "founded": 1971,
    "public_since": 1995,
    "ceo": "Chris Ripley",
    "founder": "Julian Sinclair Smith",
    "stations_1996": 31,
    "stations_2002": 62,
    "stations_2010": 77,
    "stations_2017": 173,
    "stations_2024": 185,
    "tribune_deal_blocked": True,
    "tribune_deal_year": 2018,
    "tribune_deal_would_have_reached_pct": 72,
}


def main():
    print("=" * 60)
    print("One Hundred Years -- Dead Air")
    print("Stage 05: Sinclair Must-Run Footprint")
    print("=" * 60)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / "sinclair_footprint.json"

    output = {
        "description": "Sinclair Broadcast Group station footprint and must-run segment data",
        "methodology": (
            "Station list compiled from Sinclair SEC filings, FCC license database, "
            "and station websites. Must-run segment data from published journalism "
            "and media criticism. This is a representative sample of ~30 notable stations; "
            "Sinclair operates approximately 185 stations total."
        ),
        "sources": [
            "Sinclair Broadcast Group SEC filings (10-K)",
            "FCC license database",
            "Deadspin / Timothy Burke (2018 synchronized script compilation)",
            "Columbia Journalism Review Sinclair coverage (2017-2024)",
        ],
        "summary": FOOTPRINT_SUMMARY,
        "stations": SINCLAIR_STATIONS,
        "must_run_segments": MUST_RUN_SEGMENTS,
    }

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n  [ok] Output: {out_path}")
    print(f"       {len(SINCLAIR_STATIONS)} documented stations")
    print(f"       {len(MUST_RUN_SEGMENTS)} must-run segment types")

    print(f"\n  Sinclair growth:")
    print(f"    1996: {FOOTPRINT_SUMMARY['stations_1996']} stations")
    print(f"    2002: {FOOTPRINT_SUMMARY['stations_2002']} stations")
    print(f"    2017: {FOOTPRINT_SUMMARY['stations_2017']} stations")
    print(f"    2024: {FOOTPRINT_SUMMARY['stations_2024']} stations")
    print(f"    Reach: {FOOTPRINT_SUMMARY['household_reach_pct']}% of US households")

    # Count states covered
    states = set(s["state"] for s in SINCLAIR_STATIONS)
    print(f"\n  States represented in sample: {len(states)}")

    print("\n" + "=" * 60)
    print("Sinclair footprint complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
