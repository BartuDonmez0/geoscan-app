from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
import math
import os

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data on startup
DATA_FILE = "nyc_uber_data.csv"
if os.path.exists(DATA_FILE):
    df = pd.read_csv(DATA_FILE)
else:
    df = pd.DataFrame(columns=["lat", "lon", "hour"])

def get_dbscan_clusters(hour_df, eps_km=0.15, min_samples=15):
    if len(hour_df) == 0:
        return []

    # Use haversine distance for DBSCAN
    coords = np.radians(hour_df[['lat', 'lon']].values)
    
    # eps in radians (Earth radius is ~6371 km)
    kms_per_radian = 6371.0088
    epsilon = eps_km / kms_per_radian

    db = DBSCAN(eps=epsilon, min_samples=min_samples, algorithm='ball_tree', metric='haversine').fit(coords)
    
    hour_df['cluster'] = db.labels_
    
    clusters_info = []
    # -1 is noise
    for label in set(db.labels_):
        if label == -1:
            continue
            
        cluster_points = hour_df[hour_df['cluster'] == label]
        
        # Calculate cluster center
        center_lat = cluster_points['lat'].mean()
        center_lon = cluster_points['lon'].mean()
        
        # Calculate density score (1-5 scale) for color rendering
        pts = len(cluster_points)
        density_score = 1
        if pts > 50: density_score = 2
        if pts > 150: density_score = 3
        if pts > 400: density_score = 4
        if pts > 1000: density_score = 5

        clusters_info.append({
            "id": int(label),
            "lat": float(center_lat),
            "lon": float(center_lon),
            "points": pts,
            "density_score": density_score,
            "bounds": {
                "min_lat": float(cluster_points['lat'].min()),
                "max_lat": float(cluster_points['lat'].max()),
                "min_lon": float(cluster_points['lon'].min()),
                "max_lon": float(cluster_points['lon'].max()),
            }
        })
        
    return clusters_info

@app.get("/api/density")
def get_hourly_density(hour: int):
    """
    Returns the cluster data (Geoscan) and raw points for a specific hour.
    """
    if hour < 0 or hour > 23:
        raise HTTPException(status_code=400, detail="Hour must be between 0 and 23")
        
    hour_df = df[df['hour'] == hour].copy()
    
    # Extract raw points for heatmap/scatterplot
    points = [{"lat": row["lat"], "lon": row["lon"]} for _, row in hour_df.iterrows()]
    
    # Extract clusters
    clusters = get_dbscan_clusters(hour_df)
    
    return {
        "hour": hour,
        "total_points": len(points),
        "total_clusters": len(clusters),
        "clusters": clusters,
        "points": points
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "data_loaded": len(df) > 0}
