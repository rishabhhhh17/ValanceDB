import os
import subprocess
import pandas as pd

# We use the user's kaggle token in .env if needed.
# For the demo, these scripts are written to show the interviewer the ETL logic.

DATASETS = [
    ("sudalairajkumar/indian-startup-funding", "datasets/startup_funding.csv"),
    ("rishidamarla/india-ipos-from-2010-2023",  "datasets/india_ipos.csv"),
]

os.makedirs("datasets", exist_ok=True)

def download(slug, out_path):
    if os.path.exists(out_path):
        print(f"Already exists: {out_path}")
        return
    print(f"Downloading {slug}...")
    try:
        subprocess.run(
            ["kaggle", "datasets", "download", "-d", slug, "--unzip", "-p", "datasets/"],
            check=True
        )
    except Exception as e:
        print(f"Kaggle download failed (Is API key setup correctly?): {e}")

if __name__ == "__main__":
    for slug, path in DATASETS:
        download(slug, path)
    
    try:
        startup_df = pd.read_csv("datasets/startup_funding.csv", encoding="latin1")
        ipo_df     = pd.read_csv("datasets/india_ipos.csv",      encoding="latin1")

        print("Startup funding shape:", startup_df.shape)
        print("IPO shape:",             ipo_df.shape)
    except Exception as e:
        print(f"Failed to read CSV files: {e}")
