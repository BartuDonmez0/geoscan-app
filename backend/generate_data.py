import pandas as pd
import numpy as np
import os

# Generate synthetic Uber trip data for a small city (e.g., center around a specific coordinate)
# Let's say a small fictional city center at lat: 39.920770, lon: 32.854110 (Ankara center for example)
# We will generate data for 24 hours.

def generate_synthetic_data(output_path="uber_data.csv", n_records=5000):
    np.random.seed(42)
    center_lat = 39.920770
    center_lon = 32.854110
    
    # Generate random hours (0-23)
    # Let's make it have peaks around 8 AM and 6 PM
    hours = []
    for _ in range(n_records):
        val = np.random.choice([
            np.random.normal(8, 2),   # Morning peak
            np.random.normal(18, 2),  # Evening peak
            np.random.uniform(0, 24)  # Background noise
        ], p=[0.4, 0.4, 0.2])
        hours.append(int(val) % 24)
        
    # Generate coordinates around the center for these points
    # Spread depends on hour - tight clusters during peaks, spread out during night
    lats = []
    lons = []
    for h in hours:
        if 7 <= h <= 9 or 17 <= h <= 19:
            # High density, tight cluster
            spread = 0.01
        else:
            spread = 0.03
            
        lat = np.random.normal(center_lat, spread)
        lon = np.random.normal(center_lon, spread)
        lats.append(lat)
        lons.append(lon)
        
    df = pd.DataFrame({
        'lat': lats,
        'lon': lons,
        'hour': hours
    })
    
    df.to_csv(output_path, index=False)
    print(f"Generated {n_records} synthetic records to {output_path}")

if __name__ == "__main__":
    if not os.path.exists("uber_data.csv"):
        generate_synthetic_data()
