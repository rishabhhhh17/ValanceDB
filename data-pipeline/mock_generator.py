import json
import random
import os
from datetime import datetime, timedelta

def generate_mock_deals(count=250):
    teams = {
        "Fintech": ["Arjun Mehta", "Priya Sharma", "Rohan Gupta"],
        "Consumer Tech": ["Vikram Patel", "Ananya Roy", "Karan Singh"],
        "Healthcare": ["Neha Jain", "Rishi Kapoor"],
        "EdTech": ["Ananya Roy", "Arjun Mehta"],
        "BFSI": ["Arjun Mehta", "Rishi Kapoor", "Neha Jain"],
        "Energy": ["Vikram Patel", "Karan Singh"],
        "Infrastructure": ["Neha Jain", "Rishi Kapoor", "Rohan Gupta"],
        "Other": ["Priya Sharma", "Vikram Patel"],
    }

    file_templates = {
        "ECM": ["Prospectus_{}.pdf", "IPO_Model_{}.xlsx", "Anchor_Deck_{}.pptx", "Roadshow_Pres_{}.pdf"],
        "PE/VC": ["CIM_{}.pdf", "VC_Model_{}.xlsx", "Investor_Deck_{}.pptx", "Term_Sheet_{}.pdf"],
        "M&A": ["IM_{}.pdf", "DCF_Model_{}.xlsx", "Mgmt_Presentation_{}.pptx", "Valuation_Bridge_{}.xlsx", "NDA_{}.pdf"],
        "DCM": ["Offering_Memo_{}.pdf", "Credit_Model_{}.xlsx", "Rating_Agency_Pres_{}.pptx"]
    }

    companies = [
        "Paytm", "Zomato", "Nykaa", "PolicyBazaar", "Delhivery", "Ola", "Oyo", "Swiggy",
        "Byjus", "Unacademy", "Zerodha", "Groww", "Upstox", "Cred", "Pine Labs", "Razorpay",
        "PharmEasy", "1MG", "Curefit", "Lenskart", "FirstCry", "Udaan", "ShareChat", "Meesho",
        "HDFC", "Reliance", "Tata Motors", "Infosys", "Wipro", "TCS", "ITC", "Bharti Airtel",
        "Adani", "L&T", "Sun Pharma", "Dr Reddys", "Cipla", "Mahindra", "Bajaj Auto", "Maruti"
    ]
    
    actions = ["Acquisition", "IPO", "Series C", "Series D", "Merger", "Buyout", "Bond Issuance", "Rights Issue", "Growth Equity"]

    deals = []
    
    for i in range(1, count + 1):
        corp = random.choice(companies)
        deal_type = random.choices(["M&A", "ECM", "PE/VC", "DCM"], weights=[40, 20, 30, 10])[0]
        
        if deal_type == "M&A":
            name = f"{corp} {random.choice(['Acquisition', 'Merger', 'Buyout', 'Spin-off'])}"
            tags = ["Cross-border" if random.random() > 0.8 else "Domestic", "Strategic"]
            fee_rate = random.uniform(0.005, 0.015)
        elif deal_type == "ECM":
            name = f"{corp} {random.choice(['IPO', 'FPO', 'Rights Issue'])}"
            tags = ["BSE/NSE", "Oversubscribed" if random.random() > 0.6 else "Standard"]
            fee_rate = random.uniform(0.02, 0.035)
        elif deal_type == "PE/VC":
            name = f"{corp} {random.choice(['Series C', 'Series D', 'Growth Equity'])}"
            tags = ["Growth Equity", "Unicorn" if random.random() > 0.7 else "Late Stage"]
            fee_rate = random.uniform(0.01, 0.025)
        else: # DCM
            name = f"{corp} $500M Notes"
            tags = ["Green Bond" if random.random() > 0.8 else "High Yield", "Debt"]
            fee_rate = random.uniform(0.002, 0.008)

        sector = random.choice(list(teams.keys()))
        year = random.randint(2018, 2024)
        value_cr = round(random.uniform(500, 15000), 1)
        
        team_pool = teams[sector]
        assigned_team = random.sample(team_pool, k=min(random.randint(1, 3), len(team_pool)))
        
        short_name = corp.replace(" ", "")[:10]
        files = [tmpl.format(short_name) for tmpl in file_templates[deal_type]]
        
        # randomly remove a file sometimes
        if random.random() > 0.5 and len(files) > 2:
            files.pop(random.randint(0, len(files)-1))

        status = random.choices(["Closed", "In Progress", "Pipeline"], weights=[70, 20, 10])[0]

        deal = {
            "id": i,
            "name": name,
            "client": corp,
            "type": deal_type,
            "sector": sector,
            "year": year,
            "value_cr": value_cr,
            "status": status,
            "team": assigned_team,
            "files": files,
            "tags": tags,
            "region": "India" if "Cross-border" not in tags else random.choice(["US", "UK", "Singapore"]),
            "revenue_cr": round(value_cr * fee_rate, 1),
            "source": "mock_generator"
        }
        deals.append(deal)
        
    return deals

if __name__ == "__main__":
    deals = generate_mock_deals(250)
    
    # Ensure frontend directory exists
    os.makedirs("../frontend/src/data", exist_ok=True)
    
    out_path = "../frontend/src/data/deals.json"
    with open(out_path, "w") as f:
        json.dump(deals, f, indent=2)
        
    print(f"✅ Generated {len(deals)} mock deals and saved to {out_path}")
