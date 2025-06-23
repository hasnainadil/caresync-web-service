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

    // Inject custom CSS for the instructions panel
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-routing-container {
        background: #fff !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        border-radius: 12px;
        color: #222;
        z-index: 50;
      }
      .leaflet-routing-container * {
        color: #222;
      }
      .leaflet-routing-container .leaflet-routing-alt {
        background: #f9f9f9 !important;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);

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
      show: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
    } as any).addTo(map);

    // Make the instructions panel draggable
    setTimeout(() => {
      const panel = document.querySelector('.leaflet-routing-container');
      if (panel) {
        let isDragging = false;
        let startX = 0, startY = 0, origX = 0, origY = 0;

        const onMouseDown = (e: MouseEvent | TouchEvent) => {
          isDragging = true;
          if (e instanceof MouseEvent) {
            startX = e.clientX;
            startY = e.clientY;
          } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
          }
          const rect = (panel as HTMLElement).getBoundingClientRect();
          origX = rect.left;
          origY = rect.top;
          document.body.style.userSelect = 'none';
        };
        const onMouseMove = (e: MouseEvent | TouchEvent) => {
          if (!isDragging) return;
          let clientX, clientY;
          if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
          } else {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          }
          const dx = clientX - startX;
          const dy = clientY - startY;
          (panel as HTMLElement).style.position = 'fixed';
          (panel as HTMLElement).style.left = `${origX + dx}px`;
          (panel as HTMLElement).style.top = `${Math.max(0, origY + dy)}px`;
          (panel as HTMLElement).style.zIndex = '10001';
        };
        const onMouseUp = () => {
          isDragging = false;
          document.body.style.userSelect = '';
        };
        // Attach listeners to the panel header
        const header = panel.querySelector('.leaflet-routing-geocoders') || panel;
        header.addEventListener('mousedown', onMouseDown);
        header.addEventListener('touchstart', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onMouseUp);
      }
    }, 500);

    return () => {
      if (map && routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (e) {
          // Ignore errors if already removed
        }
      }
      document.head.removeChild(style);
    };
  }, [map, start, end]);

  return null;
};

export default RoutingMachine; 