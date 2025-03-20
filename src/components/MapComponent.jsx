import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import mockRoutes from "../data/mock-routes-data";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const BikeRouteMap = ({ selectedRouteId }) => {
  const selectedRoute = mockRoutes.find(route => route.id === selectedRouteId);

  if (!selectedRoute) {
    return <p>Маршрут не найден</p>;
  }

  return (
    <MapContainer 
      center={[selectedRoute.latitude, selectedRoute.longitude]} 
      zoom={14} 
      style={{ height: "100%", width: "100%" }} 
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Маркер точки старта */}
      <Marker position={[selectedRoute.latitude, selectedRoute.longitude]} icon={customIcon}>
        <Popup>
          <strong>{selectedRoute.name}</strong>
          <br />
          {selectedRoute.description}
          <br />
          <a href={`/route/${selectedRoute.id}`}>Подробнее</a>
        </Popup>
      </Marker>

      {selectedRoute.path && selectedRoute.path.length > 1 ? (
        <Polyline positions={selectedRoute.path} pathOptions={{ color: "green", weight: 5, opacity: 0.8 }} />
      ) : (
        <Popup position={[selectedRoute.latitude, selectedRoute.longitude]}>
          <strong>Ошибка: нет данных маршрута!</strong>
        </Popup>
      )}
    </MapContainer>
  );
};

export default BikeRouteMap;
