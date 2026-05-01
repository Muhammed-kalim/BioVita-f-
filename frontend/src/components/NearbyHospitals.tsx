import React, { useState } from 'react';
import { MapPin, Search, Loader2, Hospital as HospitalIcon, AlertCircle } from 'lucide-react';
import MapComponent from './ui/MapComponent';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

interface Hospital {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
}

interface NearbyHospitalsProps {
  hideTitle?: boolean;
}

const NearbyHospitals: React.FC<NearbyHospitalsProps> = ({ hideTitle = false }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = async (lat: number, lon: number) => {
    try {
      // Overpass API Query for hospitals within 50km
      const radius = 50000; // 50km in meters
      const query = `
        [out:json];
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        out body;
      `;
      
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch hospital data');
      }
      
      const data = await response.json();
      
      const mappedHospitals: Hospital[] = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags.name || el.tags['name:en'] || 'Hospital',
        lat: el.lat,
        lon: el.lon,
        address: el.tags['addr:full'] || el.tags['addr:street'] || '',
      }));

      setHospitals(mappedHospitals);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Could not retrieve nearby hospitals. Please try again later.');
    }
  };

  const handleFindHospitals = () => {
    setLoading(true);
    setError(null);
    setHospitals([]);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        await fetchHospitals(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        let msg = 'Error getting your location.';
        if (err.code === 1) msg = 'Location access denied. Please enable it in browser settings.';
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto", !hideTitle && "px-6 py-12")}>
      {!hideTitle && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <HospitalIcon className="text-red-400" />
              Find Nearby Hospitals
            </h2>
            <p className="text-zinc-400">Locate medical facilities within a 50km radius of your current position.</p>
          </div>

          <button
            onClick={handleFindHospitals}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Nearby Hospitals
              </>
            )}
          </button>
        </div>
      )}
      
      {hideTitle && !userLocation && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
           <button
            onClick={handleFindHospitals}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-red-500/30 active:scale-95"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            {loading ? "Discovering Facilities..." : "Locate Nearby Help"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {userLocation ? (
            <MapComponent userLocation={userLocation} hospitals={hospitals} />
          ) : (
            <div className="w-full h-[400px] md:h-[600px] bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <MapPin className="text-red-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Map Ready</h3>
              <p className="text-zinc-500 max-w-xs">Click the button above to grant location access and view nearby hospitals.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl h-full flex flex-col backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-zinc-800/30">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <HospitalIcon className="w-4 h-4 text-red-400" />
                Hospitals List ({hospitals.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] p-4 space-y-3 custom-scrollbar">
              {hospitals.length > 0 ? (
                hospitals.map((h) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={h.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors group cursor-pointer"
                  >
                    <h4 className="font-medium text-white text-sm mb-1 group-hover:text-red-400 transition-colors uppercase tracking-tight">{h.name}</h4>
                    {h.address && <p className="text-xs text-zinc-500 mb-2">{h.address}</p>}
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                      <span>{h.lat.toFixed(4)} N</span>
                      <span>{h.lon.toFixed(4)} E</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 py-12">
                  <HospitalIcon className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm">No hospitals loaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitals;
