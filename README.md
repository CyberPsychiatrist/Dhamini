# Dhamini
Dhamini (Swahili for "Guarantee") is a middleware platform designed to automate loan repayments and create a unified credit scoring system for the Kenyan market.
# 🏦 Dhamini — Swahili for "Guarantee"

**Automated Loan Repayment & Credit Infrastructure Middleware**

Dhamini is a consent-based automated loan repayment and credit intelligence platform built for the East African financial market. We bridge the gap between Commercial Banks, SACCOs, Chamas, and Digital Lenders using a unified repayment and AI-driven credit scoring infrastructure.

---

## 🚀 The Problem
Lenders in Kenya face a 20–35% default rate and spend up to 30% of their budgets chasing payments. Meanwhile, borrowers pay high interest because their positive repayment history in SACCOs or Chamas is invisible to formal banks.

## ✨ Core Pillars
* **Consent-based Automated Deduction:** Automated repayment via M-Pesa Daraja, Bank APIs, and SACCO payroll systems.
* **Universal KYC Layer:** A single identity verification (IPRS/KRA) shared across institutions with borrower consent.
* **AI Credit Scoring (DCS):** A live score built from real repayment behavior across all platforms, not just CRB history.
* **Blockchain Audit Trail:** Every mandate and repayment is logged immutably on the Polygon network for transparency.

## 🛠️ Technical Stack
- **Backend:** Python (FastAPI), Node.js (Microservices), Apache Kafka
- **Frontend:** React (Web), React Native (Mobile), Africa's Talking (USSD)
- **Database:** PostgreSQL, TimescaleDB (Time-series), Redis
- **Blockchain:** Solidity Smart Contracts (Polygon PoS)
- **Payments:** M-Pesa Daraja API, PesaLink, Bank Open APIs

## 🏗️ System Architecture
Dhamini operates as a five-layer middleware system:
1. **Frontend:** Borrower portal, Lender dashboard, and Field agent app.
2. **API Gateway:** Auth, Universal KYC, and Consent management.
3. **Middleware Core:** Mandate engine, Deduction scheduler, and Payment adapters.
4. **AI Engine:** ML models for Credit Scoring and Salary Detection.
5. **External Integrations:** Safaricom Daraja, IPRS, KRA, and Commercial Banks.

## 📅 Hackathon Roadmap (Phase 1 MVP)
- [ ] M-Pesa STK Push mandate flow
- [ ] Digital Mandate hashing to Polygon Testnet
- [ ] Automated repayment simulation via Daraja Sandbox
- [ ] Real-time DCS (Dhamini Credit Score) update
- [ ] Basic Lender & Borrower Dashboards

---
**Author:** [Samson Roy Nyagwara](https://roysamson.vercel.app)
**License:** Confidential & Proprietary
