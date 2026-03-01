import pandas as pd
import os

def download_and_sample():
    # TLC FOIL Uber dataset via FiveThirtyEight
    url = "https://raw.githubusercontent.com/fivethirtyeight/uber-tlc-foil-response/master/uber-trip-data/uber-raw-data-apr14.csv"
    out_file = "nyc_uber_data.csv"
    
    print(f"Downloading NYC Uber TLC data from {url}...")
    try:
        df = pd.read_csv(url)
        
        print(f"Loaded {len(df)} rows. Filtering for NYC bounding box and sampling...")
        
        df = df.rename(columns={'Lat': 'lat', 'Lon': 'lon', 'Date/Time': 'datetime'})
        
        # Filter valid coordinates for New York City
        df = df[
            (df['lat'] > 40.5) & (df['lat'] < 40.9) &
            (df['lon'] > -74.3) & (df['lon'] < -73.7)
        ]
        
        # Extract the hour from the pickup datetime
        df['hour'] = pd.to_datetime(df['datetime']).dt.hour
        
        # Sample up to 100,000 points for dense DBScan clustering
        df_sample = df.sample(n=min(80000, len(df)), random_state=42)
        
        df_out = pd.DataFrame({
            'lat': df_sample['lat'].astype(float),
            'lon': df_sample['lon'].astype(float),
            'hour': df_sample['hour'].astype(int)
        })
        
        df_out.to_csv(out_file, index=False)
        print(f"Saved {len(df_out)} sampled trips to {out_file}")
    except Exception as e:
        print(f"Error processing CSV: {e}")

if __name__ == "__main__":
    download_and_sample()
