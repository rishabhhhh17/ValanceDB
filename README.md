# IB Deal Intelligence Dashboard

![Dashboard Preview](https://via.placeholder.com/1200x600/0f1115/d4af37?text=IB+Deal+Intelligence+Dashboard)

A full-stack, AI-powered knowledge retrieval system for Investment Banking teams. Instantly search past deal credentials, run pipeline analytics, view coverage stats, and use the Google Gemini-powered AI Advisor to query the deal corpus.

## 🚀 Quick Start (Local Development)

The project is pre-configured with 250 realistic mock deals generated via Python, bypassing any Kaggle ETL requirements for immediate use.

### 1. Run the Application
```bash
cd frontend
npm install
npm run dev
```

### 2. Environment Setup (for AI Advisor)
To enable the AI Advisor tab, you need a Gemini API Key.
1. Add your key to `frontend/.env` (already done by the script during setup).
```env
VITE_GEMINI_API_KEY=AIzaSy...
```

## 🌐 Deploying to Vercel (For Interviews)

This dashboard is heavily optimized to be deployed as a static React application on Vercel without requiring a live Python backend. All search and analytics run instantly on the client.

1. Init a Git repository and push to GitHub:
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. Inside your Vercel Dashboard:
- Click **Add New Project** and select your repository.
- **IMPORTANT:** Set the **Framework Preset** to `Vite`
- **IMPORTANT:** Set the **Root Directory** to `frontend`
- In **Environment Variables**, add:
  - `VITE_GEMINI_API_KEY` = your API key
- Click **Deploy**!

## 🧪 The Python Data Pipeline (Optional)

If you are asked about the ETL process during your interview, point them to the `data-pipeline/` folder.
- `ingest.py`: Downloads real Indian startup and IPO CSV data from Kaggle.
- `mock_generator.py`: Generates the exact `deals.json` powering this deployment, ensuring a full mix of M&A, ECM, DCM, and PE/VC deals flawlessly.
