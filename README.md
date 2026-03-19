# Saara Intelligence Corp. — Practice Intelligence Survey (v2)

## Project Overview
A premium, Apple-aesthetic survey and response dashboard for Saara Intelligence Corp.  
**Goal**: Collect pain point intelligence from doctors and practice owners, introduce Saara's AI platform, and capture tiered soft-commitment interest for investor validation.

---

## Pages

| Path | Purpose |
|---|---|
| `index.html` | The doctor-facing survey (embeddable, mobile-optimised) — **public** |
| `admin.html` | Internal response dashboard — charts, table, star/highlight system, CSV export — **password protected** |
| `investor.html` | Live read-only investor board — aggregate stats, demand signals, highlight reel — **password protected** |

---

## 🔐 Access & Passwords

| Page | URL | Password |
|---|---|---|
| Survey | `saarasurvey.com/index.html` | *(public — no password)* |
| Admin Dashboard | `saarasurvey.com/admin.html` | `saara2026!1` |
| Investor Board | `saarasurvey.com/investor.html` | `saarainvestor2026!1` |

**Session duration**: 24 hours — after 24 hours the gate reappears automatically.  
**Security note**: Client-side password gate — sufficient for team/investor sharing. Not suitable for protecting truly sensitive data.

---

## Survey Structure — 7 Steps, 25+ Questions

| Step | Title | Key Questions |
|---|---|---|
| 1 | About You | Name, clinic, specialty, size, email, years in practice |
| 2 | Pain Map | Interactive 1–5 dot rating across 6 pain categories |
| 3 | Pain Deep Dive | #1 challenge, billing detail, documentation hours/week, prior auth volume |
| 4 | Financial Picture | Annual revenue, monthly revenue lost, billing management approach |
| 5 | Tech & Readiness | EHR tools, AI familiarity, adoption timeline, budget authority |
| 6 | Meet Saara | Saara showcase, demo interest, confidence factors, referral source, would-refer |
| 7 | Express Interest | Open comments, 3-tier commitment selector, personalized statement, signed checkbox |

---

## Commitment Tiers

| Tier | Description | Value to Investors |
|---|---|---|
| ⭐ **Founding Partner** | Active beta partner, willing to co-build and be named | Highest signal — design partners |
| 🚀 **Early Access** | First in line for pilot program | Strong signal — pipeline leads |
| 📬 **Stay Informed** | Demo interest, wants updates | Soft signal — top of funnel |

---

## Admin Dashboard Features

- **4 KPI stat cards**: Total responses, soft commitments (%), demo requests (%), founding partners
- **5 charts** (Chart.js): Pain scores by category, #1 challenge distribution, commitment tiers, adoption timeline, specialty breakdown
- **Live search + 3 filters**: By tier, commitment status, demo interest
- **Full data table**: Pain map mini-visualization, tier badge, commitment dot, ⭐ star button per row
- **Row click → detail modal**: Complete per-respondent view with all fields
- **⭐ Star system**: Star any response from the table or modal to feature it on the investor board
- **Admin note**: Write a highlight quote per response — shown on the investor board
- **CSV export**: One-click download of all responses

## Investor Dashboard Features (`investor.html`)

- **4 live signal cards**: Physicians surveyed, soft commitments, founding partners, high-intent leads
- **Pain landscape**: Bar chart + visual severity breakdown by category
- **Demand signals**: Commitment tiers, demo interest, adoption timeline charts
- **Revenue opportunity**: Practice revenue range + estimated monthly losses
- **Market context**: 6 static TAM/industry data cards with sources
- **Respondent profile**: Specialty mix, practice size, budget authority charts
- **Highlight reel**: Auto-shows starred responses + comments >40 chars, with admin notes
- **Auto-refreshes every 60 seconds** — always live when shown to investors

---

## Data Model — `saara_responses` (32 fields)

| Field | Type | Source |
|---|---|---|
| `doctor_name` | text | Step 1 |
| `clinic_name` | text | Step 1 |
| `specialty` | text | Step 1 |
| `practice_size` | text | Step 1 |
| `email` | text | Step 1 |
| `years_in_practice` | text | Step 1 |
| `pain_billing` | number | Step 2 |
| `pain_compliance` | number | Step 2 |
| `pain_scheduling` | number | Step 2 |
| `pain_clinical_notes` | number | Step 2 |
| `pain_staff` | number | Step 2 |
| `pain_patient_comms` | number | Step 2 |
| `top_pain_point` | text | Step 3 |
| `billing_detail` | text | Step 3 (multi-select) |
| `documentation_hours` | text | Step 3 |
| `prior_auth_weekly` | text | Step 3 |
| `annual_revenue_est` | text | Step 4 |
| `monthly_revenue_lost` | text | Step 4 |
| `current_billing_vendor` | text | Step 4 |
| `current_tools` | text | Step 5 (multi-select) |
| `ai_openness` | text | Step 5 |
| `shopping_timeline` | text | Step 5 |
| `budget_authority` | text | Step 5 |
| `demo_interest` | text | Step 6 |
| `confidence_factors` | text | Step 6 (multi-select) |
| `referral_source` | text | Step 6 |
| `would_refer` | text | Step 6 |
| `commitment_tier` | text | Step 7 |
| `soft_commitment` | bool | Step 7 |
| `additional_comments` | rich_text | Step 7 |
| `submitted_at` | datetime | Auto |
| `is_starred` | bool | Admin — featured on investor board |
| `admin_note` | text | Admin — highlight quote for investor board |

---

## Recommended Next Steps

1. **Calendly embed** — trigger scheduling widget on success screen for "Schedule ASAP" respondents
2. **Email confirmation** — send auto-reply to doctor on submit
3. **Investor report view** — a read-only summary page showing aggregate stats and key quotes
4. **Founding partner page** — dedicated landing page for beta partners after they sign
5. **A/B test Saara description** — experiment with different value prop messaging in Step 6
6. **Password-protect admin.html** — prevent public access to response data

---

## Tech Stack
- Vanilla HTML / CSS / JavaScript (zero dependencies on survey)
- Chart.js 4.4 via jsDelivr CDN (admin dashboard only)
- Inter font via Google Fonts
- RESTful Table API (`tables/saara_responses`)
