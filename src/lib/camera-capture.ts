export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface CapturedPhotoData {
  blob: Blob;
  dataUrl: string;
  timestamp: Date;
  location: GeoPosition | null;
  address: string | null;
  width: number;
  height: number;
}
