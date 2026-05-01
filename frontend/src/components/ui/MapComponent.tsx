import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Hospital {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
}

interface MapComponentProps {
  userLocation: [number, number];
  hospitals: Hospital[];
}

// Component to handle map view updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, hospitals }) => {
  const MapContainerAny = MapContainer as any;
  const TileLayerAny = TileLayer as any;

  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
      <MapContainerAny
        center={userLocation}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayerAny
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Marker */}
        <Marker position={userLocation}>
          <Popup>
            <div className="text-zinc-900 font-medium">Your Location</div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        {hospitals.map((hospital) => (
          <Marker key={hospital.id} position={[hospital.lat, hospital.lon]}>
            <Popup>
              <div className="text-zinc-900 p-1">
                <h3 className="font-bold text-sm mb-1">{hospital.name || 'Unnamed Hospital'}</h3>
                <p className="text-xs text-zinc-500">
                  Lat: {hospital.lat.toFixed(4)}, Lon: {hospital.lon.toFixed(4)}
                </p>
                {hospital.address && <p className="text-xs mt-1 italic">{hospital.address}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater center={userLocation} />
      </MapContainerAny>
    </div>
  );
};

export default MapComponent;
