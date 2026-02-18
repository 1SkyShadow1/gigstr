
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    className?: string;
    popupContent?: string | React.ReactNode;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function BaseMap({ center, zoom = 13, className, children }: { center: [number, number], zoom?: number, className?: string, children?: React.ReactNode }) {
    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={false} 
            className={className}
            style={{ zIndex: 0 }} 
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
            <MapUpdater center={center} zoom={zoom} />
        </MapContainer>
    )
}

export function Map({ latitude, longitude, zoom = 13, className = "h-[300px] w-full rounded-md", popupContent }: MapProps) {
    // Default to New York if coordinates are invalid
    const center: [number, number] = [latitude || 40.7128, longitude || -74.0060];

    return (
        <BaseMap center={center} zoom={zoom} className={className}>
            <Marker position={center}>
                {popupContent && <Popup>{popupContent}</Popup>}
            </Marker>
        </BaseMap>
    );
}

export { Marker, Popup };
