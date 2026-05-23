"""
08_counterfactual_ensemble.py
Extension 02 — Counterfactual Ensemble

Generates 500 plausible alternative HHI trajectories answering:
"What does the American broadcast landscape look like if the 1996
Telecom Act had maintained the 1975 ownership caps?"

Method:
  1. Fit linear trend to 1975-1996 HHI (the regulated era)
  2. Project forward to 2024 with:
     - Slope drawn from Normal(fitted_slope, 0.2 * |fitted_slope|)
     - Year-over-year noise from Normal(0, sigma)
     - Mean-reverting shocks (Ornstein-Uhlenbeck style)
  3. Compute percentile bands (5/10/25/50/75/90/95)
  4. Compute market-level counterfactuals
  5. Export bands, 30 sample trajectories, summary stats
"""

import json
import os
import numpy as np

np.random.seed(42)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")

# ── Load data ───────────────────────────────────────────────────
with open(os.path.join(OUTPUT_DIR, "consolidation_hhi.json")) as f:
    hhi_raw = json.load(f)

with open(os.path.join(OUTPUT_DIR, "market_concentration.json")) as f:
    market_raw = json.load(f)

hhi_data = hhi_raw["data"]
market_data = market_raw["data"]

# ── Extract actual HHI timeseries ───────────────────────────────
years_all = np.array([d["year"] for d in hhi_data])
hhi_all = np.array([d["hhi"] for d in hhi_data], dtype=float)

# Pre-intervention window: 1975-1996
mask_pre = (years_all >= 1975) & (years_all <= 1996)
years_pre = years_all[mask_pre]
hhi_pre = hhi_all[mask_pre]

# Post-intervention window: 1997-2024
mask_post = years_all >= 1997
years_post = years_all[mask_post]
hhi_post = hhi_all[mask_post]

# ── Fit linear trend to 1975-1996 ──────────────────────────────
# HHI in this period is mostly flat (~30) with a drop at 1996 to 2.8
# We want the "regulated era" trend — use 1975-1995 to avoid the
# transition year of 1996 itself
mask_fit = (years_all >= 1975) & (years_all <= 1995)
years_fit = years_all[mask_fit]
hhi_fit = hhi_all[mask_fit]

slope, intercept = np.polyfit(years_fit, hhi_fit, 1)
print(f"Fitted trend 1975-1995: slope={slope:.4f}, intercept={intercept:.2f}")
print(f"  HHI at 1975: {intercept + slope * 1975:.2f}")
print(f"  HHI at 1996: {intercept + slope * 1996:.2f}")

# Residual sigma from the fit period
residuals = hhi_fit - (slope * years_fit + intercept)
sigma = np.std(residuals)
print(f"  Residual sigma: {sigma:.4f}")

# Since the pre-1996 HHI is basically flat at 30, sigma is tiny.
# Use an Ornstein-Uhlenbeck process: mean-reverts to ~30 with moderate noise
# This reflects the regulated regime where caps kept HHI stable
MEAN_LEVEL = 30.0  # long-run mean under regulation
THETA = 0.35       # mean-reversion speed (strong — regulation enforces)
SIGMA_OU = 3.5     # volatility per year

# ── Generate 500 counterfactual trajectories ───────────────────
N_TRAJECTORIES = 500
N_SAMPLE = 30  # sample trajectories to include in output

# Projection years: 1975-2024 (full window for visualization)
proj_years = np.arange(1975, 2025)
n_proj = len(proj_years)

trajectories = np.zeros((N_TRAJECTORIES, n_proj))

for i in range(N_TRAJECTORIES):
    # Each trajectory gets a slightly different long-run mean
    mu_i = MEAN_LEVEL + np.random.normal(0, 3.0)
    # And a slightly different drift (slight structural trend)
    drift_i = np.random.normal(0, 0.15)

    # Build trajectory year by year
    traj = np.zeros(n_proj)
    for j, yr in enumerate(proj_years):
        if yr <= 1996:
            # Use actual data for pre-intervention period
            idx = np.where(years_all == yr)[0]
            if len(idx) > 0:
                traj[j] = hhi_all[idx[0]]
            else:
                traj[j] = MEAN_LEVEL
        else:
            # Ornstein-Uhlenbeck step
            target = mu_i + drift_i * (yr - 1996)
            prev = traj[j - 1]
            reversion = THETA * (target - prev)
            noise = np.random.normal(0, SIGMA_OU)
            traj[j] = prev + reversion + noise

            # Floor/ceiling: regulatory regime keeps HHI bounded
            traj[j] = max(traj[j], 10.0)
            traj[j] = min(traj[j], 65.0)

    trajectories[i] = traj

# ── Compute percentile bands ──────────────────────────────────
percentiles = [5, 10, 25, 50, 75, 90, 95]
bands = {}
for p in percentiles:
    bands[f"p{p}"] = np.percentile(trajectories, p, axis=0).tolist()

# ── Select 30 sample trajectories ─────────────────────────────
sample_indices = np.random.choice(N_TRAJECTORIES, N_SAMPLE, replace=False)
sample_trajectories = []
for idx in sorted(sample_indices):
    sample_trajectories.append(trajectories[idx].tolist())

# ── Actual HHI for the projection window ──────────────────────
actual_hhi = []
for yr in proj_years:
    idx = np.where(years_all == yr)[0]
    if len(idx) > 0:
        actual_hhi.append(float(hhi_all[idx[0]]))
    else:
        actual_hhi.append(None)

# ── Market-level counterfactuals ──────────────────────────────
# For each market, project c1996 forward with slow growth (matching
# the 1990-1996 trend) vs actual 2024 concentration
market_counterfactuals = []
for m in market_data:
    c90 = m["c1990"]
    c96 = m["c1996"]
    c24 = m["c2024"]

    # Pre-1996 annual growth rate
    if c90 > 0:
        annual_growth = (c96 / c90) ** (1.0 / 6.0) - 1.0
    else:
        annual_growth = 0.01

    # Project 28 years forward from 1996 with regulated growth
    # Under strict caps, growth would be dampened — apply a friction factor
    dampened_growth = annual_growth * 0.5  # regulation halves the growth rate
    cf_2024 = c96 * (1 + dampened_growth) ** 28
    # Cap at reasonable level under regulation
    cf_2024 = min(cf_2024, 0.30)

    # Generate 500 market trajectories for confidence
    cf_samples = []
    for _ in range(N_TRAJECTORIES):
        g = np.random.normal(dampened_growth, abs(dampened_growth) * 0.4)
        cf = c96 * (1 + g) ** 28
        cf = min(max(cf, c90 * 0.8), 0.35)
        cf_samples.append(cf)

    cf_median = float(np.median(cf_samples))
    cf_p25 = float(np.percentile(cf_samples, 25))
    cf_p75 = float(np.percentile(cf_samples, 75))

    market_counterfactuals.append({
        "id": m["id"],
        "name": m["name"],
        "actual_2024": round(c24, 3),
        "counterfactual_2024": round(cf_median, 3),
        "cf_p25": round(cf_p25, 3),
        "cf_p75": round(cf_p75, 3),
        "difference": round(c24 - cf_median, 3),
        "would_be_competitive": cf_median < 0.25,
    })

# ── Summary statistics ─────────────────────────────────────────
median_cf_2024 = float(np.median(trajectories[:, -1]))
actual_2024_hhi = hhi_all[years_all == 2024][0]
hhi_diff = float(actual_2024_hhi - median_cf_2024)
markets_saved = sum(1 for m in market_counterfactuals if m["would_be_competitive"])
markets_total = len(market_counterfactuals)

# Confidence: what fraction of trajectories end below actual?
frac_below = float(np.mean(trajectories[:, -1] < actual_2024_hhi))

print(f"\n── Summary ──")
print(f"Actual HHI 2024:       {actual_2024_hhi:.1f}")
print(f"Median CF HHI 2024:    {median_cf_2024:.1f}")
print(f"Difference:            {hhi_diff:.1f}")
print(f"Markets competitive:   {markets_saved}/{markets_total}")
print(f"P(CF < actual):        {frac_below:.1%}")

# ── Build output ───────────────────────────────────────────────
output = {
    "description": "Counterfactual ensemble: 500 alternative HHI trajectories under maintained 1975 ownership caps",
    "methodology": {
        "intervention_year": 1996,
        "fit_window": "1975-1995",
        "fitted_slope": round(float(slope), 6),
        "fitted_intercept": round(float(intercept), 2),
        "noise_sigma": round(float(SIGMA_OU), 2),
        "n_trajectories": N_TRAJECTORIES,
        "mean_reversion_rate": THETA,
        "process": "Ornstein-Uhlenbeck with per-trajectory mean and drift",
        "constraints": "HHI floor 10, ceiling 65 (regulatory cap regime)",
    },
    "years": proj_years.tolist(),
    "actual_hhi": actual_hhi,
    "bands": bands,
    "sample_trajectories": sample_trajectories,
    "markets": market_counterfactuals,
    "summary": {
        "actual_hhi_2024": round(float(actual_2024_hhi), 1),
        "median_counterfactual_2024": round(median_cf_2024, 1),
        "hhi_difference": round(hhi_diff, 1),
        "markets_saved": markets_saved,
        "markets_total": markets_total,
        "confidence": round(frac_below, 3),
        "percentile_2024": {
            f"p{p}": round(float(np.percentile(trajectories[:, -1], p)), 1)
            for p in percentiles
        },
    },
}

out_path = os.path.join(OUTPUT_DIR, "counterfactual_ensemble.json")
with open(out_path, "w") as f:
    json.dump(output, f, indent=2)

print(f"\nWrote {out_path}")
print(f"  {len(output['sample_trajectories'])} sample trajectories")
print(f"  {len(output['markets'])} market counterfactuals")
