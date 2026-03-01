import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW_STATE = {
  longitude: -74.0060,
  latitude: 40.7128,
  zoom: 11,
  minZoom: 10,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

// Bounding box for NYC to restrict the map area
const NYC_BOUNDS = [
  [-74.25909, 40.477399], // Southwest coordinates (approx Staten Island)
  [-73.700272, 40.917577] // Northeast coordinates (approx Bronx/Queens border)
];

// Map style (dark mode map)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export default function MapComponent({ mapData, isAuthenticated, onClusterClick, selectedCluster }) {
  const layers = [];

  if (mapData && mapData.points) {
    layers.push(
      new HeatmapLayer({
        id: 'heatmapLayer',
        data: mapData.points,
        getPosition: d => [d.lon, d.lat],
        getWeight: d => 1,
        radiusPixels: 50,
        intensity: 1,
        threshold: 0.1,
        colorRange: [
          [28, 0, 0, 50],
          [80, 0, 0, 100],
          [139, 0, 0, 150],
          [200, 20, 20, 200],
          [255, 60, 60, 250],
          [255, 120, 120, 255]
        ]
      })
    );
  }

  // Red aesthetic density scale
  const DENSITY_COLORS = {
    1: [255, 200, 200, 180], // Light Red
    2: [255, 100, 100, 200], // Red
    3: [220, 20, 20, 220],   // Crimson
    4: [150, 0, 0, 240],     // Dark Red
    5: [80, 0, 0, 255]       // Very Dark Red
  };

  if (mapData && mapData.clusters) {
    layers.push(
      new ScatterplotLayer({
        id: 'clusterLayer',
        data: mapData.clusters,
        getPosition: d => [d.lon, d.lat],
        getFillColor: d => DENSITY_COLORS[d.density_score] || [255, 60, 60, 200],
        getLineColor: [255, 255, 255],
        getRadius: d => Math.max(d.points * 3, 70), // Increased size for clickability
        lineWidthMinPixels: 2,
        pickable: true,
        onClick: (info) => {
          if (info.object && onClusterClick) {
            onClusterClick(info.object);
          }
        }
      })
    );
  }

  // selected cluster ring overlay
  if (selectedCluster) {
    layers.push(
      new ScatterplotLayer({
        id: 'selectedClusterLayer',
        data: [selectedCluster],
        getPosition: d => [d.lon, d.lat],
        getFillColor: [0, 0, 0, 0], // transparent inner
        getLineColor: [255, 255, 255, 255], // stark white border
        lineWidthMinPixels: 4,
        getRadius: d => Math.max(d.points * 3, 70) + 150, // outer ring
        stroked: true,
        pickable: false, // background effect only
      })
    );
  }

  const getTooltip = ({ object }) => {
    if (!object) return null;
    return `Cluster ID: ${object.id}\nDensity: ${object.points} Trips\nBounds: Lat [${object.bounds.min_lat.toFixed(4)}, ${object.bounds.max_lat.toFixed(4)}]`;
  };

  return (
    <div className={`absolute inset-0 transition-all duration-1000 ${!isAuthenticated ? 'blur-md opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={false} // Haritayı tamamen sabitledik (kullanıcı isteği)
        layers={layers}
        getTooltip={getTooltip}
      >
        <Map
          mapStyle={MAP_STYLE}
          reuseMaps
          preventStyleDiffing={true}
          maxBounds={NYC_BOUNDS}
        />
      </DeckGL>
    </div>
  );
}
