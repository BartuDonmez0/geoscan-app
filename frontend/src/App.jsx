import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import DisclaimerOverlay from './components/DisclaimerOverlay';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hour, setHour] = useState(8); // Default to 8 AM
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    // Determine the API URL depending on whether we are in dev or prod
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Fetch density data from backend
    fetch(`${API_URL}/api/density?hour=${hour}`)
      .then(res => res.json())
      .then(json => {
        setMapData(json);
        setSelectedCluster(null);
      })
      .catch(err => console.error("Error fetching map data: ", err));
  }, [hour]);

  const handleAccept = () => {
    setIsAuthenticated(true);
  };

  const handleHourChange = (e) => {
    setHour(parseInt(e.target.value, 10));
  };

  const handleClusterClick = (cluster) => {
    setSelectedCluster(cluster);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900 font-sans">
      <MapComponent
        mapData={mapData}
        isAuthenticated={isAuthenticated}
        onClusterClick={handleClusterClick}
        selectedCluster={selectedCluster}
      />

      {!isAuthenticated && <DisclaimerOverlay onAccept={handleAccept} />}

      {isAuthenticated && (
        <div className="absolute top-6 left-6 z-10 w-80 p-6 rounded-2xl bg-black/90 backdrop-blur-xl border border-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.1)] text-white transition-all">
          <h2 className="text-2xl font-bold text-white mb-1">
            GeoScan
            <span className="block text-lg font-light text-gray-400">for New York City</span>
          </h2>
          <p className="text-xs text-gray-500 mb-6 italic">
            by bartu dönmez
          </p>

          <div className="mb-4">
            {mapData && (
              <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Toplam Yolculuk</div>
                <div className="text-2xl font-mono text-white tracking-widest">{mapData.points.length.toLocaleString()}</div>
              </div>
            )}
            <label className="flex justify-between text-sm font-medium mb-3 text-gray-300">
              <span>Günün Saati</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-mono text-white">
                {hour.toString().padStart(2, '0')}:00
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={handleHourChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/10">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Harita Renk Lejantı (Yoğunluk)</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-xs text-gray-300"><span className="w-3 h-3 rounded-full bg-[#500000] mr-2 shadow-[0_0_5px_#f00]"></span> Çok Yüksek (Aşırı Yoğun)</div>
              <div className="flex items-center text-xs text-gray-300"><span className="w-3 h-3 rounded-full bg-[#960000] mr-2"></span> Yüksek (Yoğun)</div>
              <div className="flex items-center text-xs text-gray-300"><span className="w-3 h-3 rounded-full bg-[#dc1414] mr-2"></span> Orta</div>
              <div className="flex items-center text-xs text-gray-300"><span className="w-3 h-3 rounded-full bg-[#ff6464] mr-2"></span> Düşük</div>
              <div className="flex items-center text-xs text-gray-300"><span className="w-3 h-3 rounded-full bg-[#ffc8c8] mr-2"></span> Çok Düşük (Sakin)</div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {isAuthenticated && selectedCluster && (
        <div className="absolute top-6 right-6 bottom-6 w-96 z-10 p-6 rounded-2xl bg-black/90 backdrop-blur-xl border border-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.1)] text-white flex flex-col transition-all">
          <div className="flex justify-between items-center mb-6 border-b border-red-900/30 pb-4">
            <h3 className="text-xl font-bold">Bölge Raporu #{selectedCluster.id}</h3>
            <button
              onClick={() => setSelectedCluster(null)}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 text-sm text-gray-300">
              Bu panel, haritada seçtiğiniz belirli bir noktanın detaylı analizini sunar. Seçtiğiniz bu bölgede insanların saat kaçta yoğunlaştığını görebilirsiniz.
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Seçili Saat</div>
                <div className="text-xl font-mono">{hour.toString().padStart(2, '0')}:00</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Toplam Yolculuk</div>
                <div className="text-2xl font-bold">{selectedCluster.points.toLocaleString()}</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">Hacim Grafiği</h4>
              <div className="h-48 w-full bg-white/5 rounded-xl border border-white/10 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: 'Volume', trips: selectedCluster.points }]}>
                    <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa' }} />
                    <YAxis stroke="#888" tick={{ fill: '#aaa' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
                      {
                        // Match map color scale
                        [{ name: 'Volume', trips: selectedCluster.points }].map((entry, index) => {
                          const densityColor = selectedCluster.density_score === 5 ? '#500000' :
                            selectedCluster.density_score === 4 ? '#960000' :
                              selectedCluster.density_score === 3 ? '#dc1414' :
                                selectedCluster.density_score === 2 ? '#ff6464' : '#ffc8c8';
                          return <Cell key={`cell-${index}`} fill={densityColor} />
                        })
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-3 italic text-center">
                Seçilen bölgedeki tahmini trafik yoğunluğunun görsel dağılımı.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-widest">Bölge Koordinatları</h4>
              <p className="text-xs text-gray-500 mb-2">Bu veriler seçilen yoğun alanın haritadaki matematiksel sınırlarını ve merkezini belirtir.</p>
              <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-gray-400 space-y-2">
                <div className="flex justify-between"><span>Enlem (Lat):</span> <span className="text-white">{selectedCluster.lat.toFixed(6)}</span></div>
                <div className="flex justify-between"><span>Boylam (Lon):</span> <span className="text-white">{selectedCluster.lon.toFixed(6)}</span></div>
                <div className="flex justify-between text-gray-600 pt-2 border-t border-white/5"><span>Sınır Min:</span> <span>{selectedCluster.bounds.min_lat.toFixed(4)}, {selectedCluster.bounds.min_lon.toFixed(4)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Sınır Maks:</span> <span>{selectedCluster.bounds.max_lat.toFixed(4)}, {selectedCluster.bounds.max_lon.toFixed(4)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Cluster Selection Bar */}
      {isAuthenticated && mapData && mapData.clusters && mapData.clusters.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl px-6 transition-all duration-300">
          <div className="bg-black/90 backdrop-blur-xl border border-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.1)] rounded-2xl p-4 text-white">
            <div className="flex justify-between text-sm font-medium mb-3 text-gray-300 px-2">
              <span>Nokta (Cluster) Seçimi</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-mono text-white text-xs">
                {selectedCluster ? `Seçili Cluster: #${selectedCluster.id}` : 'Haritadan veya Çubuktan Seçin'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 font-mono">1</span>
              <input
                type="range"
                min="1"
                max={mapData.clusters.length}
                value={selectedCluster ? mapData.clusters.findIndex(c => c.id === selectedCluster.id) + 1 : 1}
                onChange={(e) => setSelectedCluster(mapData.clusters[e.target.value - 1])}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <span className="text-xs text-gray-500 font-mono">{mapData.clusters.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
