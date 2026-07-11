"use client";

import { useEffect, useState } from "react";
import type { GeoPosition } from "@/lib/camera-capture";

interface UseGeolocationWatchResult {
  position: GeoPosition | null;
  error: string | null;
}

const isGeolocationSupported =
  typeof navigator !== "undefined" && "geolocation" in navigator;

export function useGeolocationWatch(
  enabled: boolean,
): UseGeolocationWatchResult {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(() =>
    isGeolocationSupported ? null : "Perangkat tidak mendukung Geolocation",
  );

  useEffect(() => {
    if (!enabled || !isGeolocationSupported) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return { position, error };
}
