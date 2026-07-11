"use client";

import { useEffect, useRef, useState } from "react";
import { calculateDistanceMeters } from "@/lib/geo-utils";
import type { GeoPosition } from "@/lib/camera-capture";

const RE_GEOCODE_THRESHOLD_METERS = 25;
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

interface UseCachedReverseGeocodeResult {
  address: string | null;
  isResolving: boolean;
  error: string | null;
}

export function useCachedReverseGeocode(
  position: GeoPosition | null,
): UseCachedReverseGeocodeResult {
  const [address, setAddress] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anchorRef = useRef<GeoPosition | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!position) return;
    if (isFetchingRef.current) return;

    const anchor = anchorRef.current;

    const shouldFetch =
      anchor === null ||
      calculateDistanceMeters(
        anchor.lat,
        anchor.lng,
        position.lat,
        position.lng,
      ) > RE_GEOCODE_THRESHOLD_METERS;

    if (!shouldFetch) return;

    isFetchingRef.current = true;
    setIsResolving(true);
    setError(null);

    const params = new URLSearchParams({
      lat: position.lat.toString(),
      lon: position.lng.toString(),
      format: "json",
    });

    fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "Accept-Language": "id,en",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.display_name) {
          anchorRef.current = position;
          setAddress(data.display_name as string);
        } else {
          setError("Alamat tidak ditemukan");
        }
      })
      .catch((err: Error) => {
        setError(`Reverse geocoding gagal: ${err.message}`);
      })
      .finally(() => {
        isFetchingRef.current = false;
        setIsResolving(false);
      });
  }, [position]);

  return { address, isResolving, error };
}