#!/usr/bin/env python3
"""
06_public_interest.py — Regulatory Timeline
=============================================
The legislative and regulatory history of the public interest obligation
in American broadcasting.

Sources:
  - Federal Communications Commission archived orders and rulings
  - Federal Register (Code of Federal Regulations, Title 47)
  - Communications Act of 1934 (47 U.S.C.)
  - Telecommunications Act of 1996 (Pub. L. 104-104)
  - Published legal scholarship on broadcast regulation:
    - Thomas Krattenmaker & Lucas Powe, 'Regulating Broadcast Programming' (1994)
    - Yochai Benkler, 'The Wealth of Networks' (2006)
    - Robert McChesney, 'The Problem of the Media' (2004)

Output: pipeline/output/regulatory_timeline.json
"""

import json
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output"

REGULATORY_TIMELINE = [
    {
        "year": 1927,
        "label": "Radio Act of 1927",
        "type": "regulation",
        "desc": (
            "Established the Federal Radio Commission. First codification of the "
            "'public interest, convenience, and necessity' standard for broadcast licensing. "
            "Created the legal foundation that airwaves are a public resource."
        ),
        "citation": "Radio Act of 1927, Pub. L. 69-632",
        "significance": "HIGH",
    },
    {
        "year": 1934,
        "label": "Communications Act of 1934",
        "type": "regulation",
        "desc": (
            "Created the FCC, replacing the Federal Radio Commission. Established that "
            "airwaves are a public resource, licensed in the 'public interest, convenience, "
            "and necessity.' Set ownership caps: 7 AM, 7 FM, 7 TV stations per entity."
        ),
        "citation": "Communications Act of 1934, 47 U.S.C. ss 151 et seq.",
        "significance": "HIGH",
    },
    {
        "year": 1941,
        "label": "Chain Broadcasting Rules",
        "type": "regulation",
        "desc": (
            "FCC rules limiting network control over affiliate stations. Required that "
            "affiliates retain the right to reject network programming. Broke NBC into "
            "two networks (NBC and ABC)."
        ),
        "citation": "FCC Report on Chain Broadcasting (1941)",
        "significance": "MEDIUM",
    },
    {
        "year": 1949,
        "label": "Fairness Doctrine",
        "type": "regulation",
        "desc": (
            "Required broadcasters to present contrasting viewpoints on controversial "
            "issues of public importance. Codified the public trustee model of broadcasting. "
            "Broadcasters had an affirmative obligation to cover issues and provide balance."
        ),
        "citation": "FCC Report on Editorializing by Broadcast Licensees, 13 FCC 1246 (1949)",
        "significance": "HIGH",
    },
    {
        "year": 1960,
        "label": "Programming Guidelines",
        "type": "regulation",
        "desc": (
            "FCC issued guidelines requiring stations to serve community needs through "
            "local programming, news, and public affairs content. Listed 14 categories "
            "of programming that serve the public interest."
        ),
        "citation": "FCC Report and Statement of Policy re: Commission en banc Programming Inquiry, 25 Fed. Reg. 7291 (1960)",
        "significance": "MEDIUM",
    },
    {
        "year": 1967,
        "label": "Public Broadcasting Act",
        "type": "regulation",
        "desc": (
            "Created the Corporation for Public Broadcasting (CPB), leading to PBS and NPR. "
            "Established the principle that some broadcasting should be insulated from "
            "commercial pressures entirely."
        ),
        "citation": "Public Broadcasting Act of 1967, Pub. L. 90-129",
        "significance": "MEDIUM",
    },
    {
        "year": 1970,
        "label": "Financial Interest and Syndication Rules",
        "type": "regulation",
        "desc": (
            "Prevented TV networks from owning the programs they broadcast, promoting "
            "diversity of content producers. Later repealed in 1995."
        ),
        "citation": "47 C.F.R. ss 73.658(j)",
        "significance": "MEDIUM",
    },
    {
        "year": 1971,
        "label": "Ascertainment Requirements",
        "type": "regulation",
        "desc": (
            "Stations required to survey community leaders and the public to identify "
            "local issues, then demonstrate in license renewal applications how their "
            "programming addressed those issues."
        ),
        "citation": "Primer on Ascertainment of Community Problems, 27 FCC 2d 650 (1971)",
        "significance": "MEDIUM",
    },
    {
        "year": 1975,
        "label": "Cross-Ownership Ban",
        "type": "regulation",
        "desc": (
            "Prohibited common ownership of a newspaper and broadcast station in the "
            "same market. Designed to preserve media voice diversity in local markets."
        ),
        "citation": "47 C.F.R. ss 73.3555(d)",
        "significance": "MEDIUM",
    },
    {
        "year": 1981,
        "label": "Deregulation of Radio",
        "type": "deregulation",
        "desc": (
            "FCC under Mark Fowler eliminated formal ascertainment requirements, "
            "programming guidelines, and commercial time limits for radio. Fowler "
            "described television as 'a toaster with pictures.'"
        ),
        "citation": "Deregulation of Radio, 84 FCC 2d 968 (1981)",
        "significance": "MEDIUM",
    },
    {
        "year": 1984,
        "label": "Deregulation of Television / Ownership Cap Raised",
        "type": "deregulation",
        "desc": (
            "FCC extended radio deregulation to television: eliminated programming "
            "guidelines and ascertainment requirements. Raised ownership cap from "
            "7-7-7 to 12-12-12 (12 AM, 12 FM, 12 TV stations per entity)."
        ),
        "citation": "Revision of Radio Rules, 101 FCC 2d 901 (1984)",
        "significance": "MEDIUM",
    },
    {
        "year": 1987,
        "label": "Fairness Doctrine Repealed",
        "type": "deregulation",
        "desc": (
            "FCC eliminated the Fairness Doctrine, arguing it chilled free speech and "
            "was no longer necessary given the growth of media outlets. Congress passed "
            "legislation to codify the doctrine; President Reagan vetoed it. Removed the "
            "obligation to present balanced viewpoints. Opened the door to partisan talk radio."
        ),
        "citation": "Syracuse Peace Council, 2 FCC Rcd 5043 (1987)",
        "significance": "HIGH",
    },
    {
        "year": 1992,
        "label": "Ownership Caps Raised",
        "type": "deregulation",
        "desc": (
            "FCC raised national ownership caps from 12-12 to 18-18, then to 20-20 "
            "(later raised to 30-30 before the 1996 Act). Each step enabled larger "
            "station groups."
        ),
        "citation": "Revision of Radio Rules, 7 FCC Rcd 6387 (1992)",
        "significance": "MEDIUM",
    },
    {
        "year": 1996,
        "label": "Telecommunications Act of 1996",
        "type": "deregulation",
        "desc": (
            "Eliminated the national radio ownership cap entirely. Raised TV ownership cap "
            "to 35% national audience reach. Raised local radio ownership limits based on "
            "market size (up to 8 stations in large markets). Triggered the largest wave of "
            "media consolidation in American history. Within four years, Clear Channel grew "
            "from 40 stations to 1,200. The number of radio station owners fell from "
            "5,100 to ~3,400 in five years."
        ),
        "citation": "Telecommunications Act of 1996, Pub. L. 104-104, 110 Stat. 56",
        "significance": "HIGH",
    },
    {
        "year": 2003,
        "label": "FCC Loosens Cross-Ownership Rules",
        "type": "deregulation",
        "desc": (
            "FCC voted 3-2 to relax newspaper/broadcast cross-ownership rules and raise "
            "TV ownership cap from 35% to 45%. Generated 3 million public comments, the "
            "most in FCC history at that time. Third Circuit Court of Appeals blocked "
            "most of the changes in Prometheus Radio Project v. FCC (2004)."
        ),
        "citation": "2002 Biennial Regulatory Review, 18 FCC Rcd 13620 (2003)",
        "significance": "HIGH",
    },
    {
        "year": 2004,
        "label": "Prometheus Radio Project v. FCC",
        "type": "judicial",
        "desc": (
            "Third Circuit Court of Appeals blocked FCC's 2003 ownership deregulation. "
            "Found FCC had not adequately justified relaxing cross-ownership rules. "
            "Remanded for further proceedings that continued for nearly two decades."
        ),
        "citation": "Prometheus Radio Project v. FCC, 373 F.3d 372 (3d Cir. 2004)",
        "significance": "HIGH",
    },
    {
        "year": 2007,
        "label": "FCC Again Loosens Cross-Ownership",
        "type": "deregulation",
        "desc": (
            "FCC voted to allow newspaper/broadcast cross-ownership in top-20 markets "
            "under certain conditions. Again challenged in court."
        ),
        "citation": "2006 Quadrennial Regulatory Review, 23 FCC Rcd 2010 (2007)",
        "significance": "MEDIUM",
    },
    {
        "year": 2017,
        "label": "Cross-Ownership Rules Repealed",
        "type": "deregulation",
        "desc": (
            "FCC under Chairman Ajit Pai eliminated the newspaper/broadcast cross-ownership "
            "ban and the radio/TV cross-ownership rule, both in place since the 1970s. "
            "Ended the UHF discount restoration that effectively raised TV ownership "
            "cap above 39%."
        ),
        "citation": "2014 Quadrennial Regulatory Review, 32 FCC Rcd 9802 (2017)",
        "significance": "HIGH",
    },
    {
        "year": 2017,
        "label": "Main Studio Rule Eliminated",
        "type": "deregulation",
        "desc": (
            "FCC eliminated the requirement that stations maintain a main studio in or "
            "near their community of license. Stations could now be operated entirely "
            "from remote locations, ending the requirement of physical local presence."
        ),
        "citation": "Elimination of Main Studio Rule, 32 FCC Rcd 8158 (2017)",
        "significance": "HIGH",
    },
    {
        "year": 2021,
        "label": "Supreme Court Upholds FCC Deregulation",
        "type": "judicial",
        "desc": (
            "In FCC v. Prometheus Radio Project, the Supreme Court unanimously upheld "
            "FCC's 2017 repeal of cross-ownership rules. Ended nearly two decades of "
            "litigation. Justice Kavanaugh wrote that the FCC had reasonably concluded "
            "the old rules were no longer necessary."
        ),
        "citation": "FCC v. Prometheus Radio Project, 593 U.S. ___ (2021)",
        "significance": "HIGH",
    },
    {
        "year": 2024,
        "label": "Reform Efforts Stalled",
        "type": "stalled",
        "desc": (
            "Congressional attempts to restore local ownership incentives, reinstate "
            "public interest obligations, and address media consolidation stalled in "
            "committee. The Local Journalism Sustainability Act and similar proposals "
            "failed to advance. Status quo consolidation continues."
        ),
        "citation": "Various congressional proposals (117th-118th Congress)",
        "significance": "MEDIUM",
    },
]


def main():
    print("=" * 60)
    print("One Hundred Years -- Dead Air")
    print("Stage 06: Regulatory Timeline (Public Interest)")
    print("=" * 60)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / "regulatory_timeline.json"

    output = {
        "description": "Legislative and regulatory history of the public interest obligation in US broadcasting",
        "methodology": (
            "Timeline compiled from FCC archived orders, Federal Register entries, "
            "congressional legislation, and federal court decisions. Citations provided "
            "for each entry. This is the factual record of how the public interest "
            "obligation was established and systematically dismantled."
        ),
        "sources": [
            "FCC archived orders and rulings",
            "Federal Register (47 C.F.R.)",
            "Congressional legislation (public laws)",
            "Federal court decisions",
            "Krattenmaker & Powe, 'Regulating Broadcast Programming' (1994)",
            "McChesney, 'The Problem of the Media' (2004)",
        ],
        "count": len(REGULATORY_TIMELINE),
        "data": REGULATORY_TIMELINE,
    }

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n  [ok] Output: {out_path}")
    print(f"       {len(REGULATORY_TIMELINE)} regulatory events")

    # Summary by type
    by_type = {}
    for e in REGULATORY_TIMELINE:
        t = e["type"]
        by_type[t] = by_type.get(t, 0) + 1

    print(f"\n  By type:")
    for t, c in sorted(by_type.items()):
        print(f"    {t}: {c}")

    reg = [e for e in REGULATORY_TIMELINE if e["type"] == "regulation"]
    dereg = [e for e in REGULATORY_TIMELINE if e["type"] == "deregulation"]
    print(f"\n  Regulation era: {reg[0]['year']}-{reg[-1]['year']}")
    print(f"  Deregulation era: {dereg[0]['year']}-{dereg[-1]['year']}")

    print("\n" + "=" * 60)
    print("Regulatory timeline complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
