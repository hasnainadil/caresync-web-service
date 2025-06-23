import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";

// Define the custom icon
const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RoutingMachineProps {
  start: [number, number];
  end: [number, number];
}

const RoutingMachine: React.FC<RoutingMachineProps> = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]), 
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 4, opacity: 0.8 }],
        extendToWaypoints: false,
        missingRouteTolerance: 1,
      },
      createMarker: function (i: number, waypoint: any, n: number) {
        const marker = L.marker(waypoint.latLng, {
          icon: customIcon,
          draggable: true,
        });
        const label = i === 0 ? "Your Location" : "Destination";
        marker.bindPopup(`<b>${label}</b>`);
        return marker;
      },
      show: false, // We hide the default turn-by-turn instructions panel
      addWaypoints: false,
      fitSelectedRoutes: true,
    } as any).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

export default RoutingMachine; 