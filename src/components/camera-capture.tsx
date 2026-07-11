"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, MapPin, RotateCcw, SwitchCamera, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGeolocationWatch } from "@/hooks/use-geolocation-watch";
import { useCachedReverseGeocode } from "@/hooks/use-cached-reverse-geocode";
import {
  formatCoordinates,
  formatRunningTimestamp,
} from "@/lib/geo-utils";
import type { CapturedPhotoData } from "@/lib/camera-capture";

interface CameraCaptureProps {
  onCapture: (data: CapturedPhotoData) => void;
  onClose?: () => void;
  facingMode?: "environment" | "user";
  watermark?: boolean;
  className?: string;
}

export function CameraCapture({
  onCapture,
  onClose,
  facingMode = "environment",
  watermark = true,
  className,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [activeFacingMode, setActiveFacingMode] = useState<
    "environment" | "user"
  >(facingMode);

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const { position, error: geoError } = useGeolocationWatch(true);
  const { address, isResolving } = useCachedReverseGeocode(position);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      setIsStreamReady(false);
      setCameraError(null);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: activeFacingMode,
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsStreamReady(true);
      } catch (err) {
        setCameraError(
          err instanceof Error ? err.message : "Gagal mengakses kamera",
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [activeFacingMode]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleSwitchCamera = useCallback(() => {
    setActiveFacingMode((prev) =>
      prev === "environment" ? "user" : "environment",
    );
  }, []);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isStreamReady) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    const timestamp = new Date();

    if (watermark) {
      drawWatermark(ctx, width, height, {
        timestampLabel: formatRunningTimestamp(timestamp),
        coordsLabel: position
          ? formatCoordinates(position.lat, position.lng)
          : null,
        addressLabel: address,
      });
    }

    const exportCanvas = () => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          onCapture({
            blob,
            dataUrl,
            timestamp,
            location: position,
            address,
            width,
            height,
          });
        },
        "image/jpeg",
        0.92,
      );
    };

    const logo = new window.Image();
    logo.onload = () => {
      const logoHeight = Math.round(width * 0.15);
      const logoWidth = Math.round((logo.naturalWidth / logo.naturalHeight) * logoHeight);
      const margin = Math.round(width * 0.015);
      ctx.drawImage(logo, margin, margin, logoWidth, logoHeight);
      exportCanvas();
    };
    logo.onerror = () => {
      exportCanvas();
    };
    logo.src = "/logo-camera.png";
  }, [isStreamReady, position, address, watermark, onCapture]);

  return (
    <div
      className={`fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-black ${className ?? ""}`}
      style={{ touchAction: "none" }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover ${
          activeFacingMode === "user" ? "scale-x-[-1]" : ""
        }`}
      />
      <canvas ref={canvasRef} className="hidden" />

      <div
        className="absolute left-4 z-10"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        <Image
          src="/logo-camera.png"
          alt="Logo"
          width={72}
          height={72}
          className="h-10 w-auto drop-shadow"
          priority
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {onClose && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute cursor-pointer right-4 z-10 rounded-full"
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      )}

      <div
        className="absolute inset-x-0 z-10 flex flex-col gap-2 px-4"
        style={{ bottom: "calc(7.5rem + env(safe-area-inset-bottom))" }}
      >
        <Badge
          variant="secondary"
          className="w-fit rounded-lg bg-black/60 text-white backdrop-blur-sm"
        >
          {formatRunningTimestamp(now)}
        </Badge>

        {position && (
          <Badge
            variant="secondary"
            className="w-fit rounded-lg bg-black/60 text-white backdrop-blur-sm"
          >
            <MapPin className="mr-1 h-3 w-3" />
            {formatCoordinates(position.lat, position.lng)}
            {position.accuracy ? ` (±${Math.round(position.accuracy)}m)` : ""}
          </Badge>
        )}

        <Badge
          variant="secondary"
          className="max-w-[90vw] rounded-lg whitespace-normal wrap-break-word bg-black/60 text-white backdrop-blur-sm"
        >
          {address ?? (isResolving ? "Mencari alamat..." : "Alamat belum tersedia")}
        </Badge>

        {(geoError || cameraError) && (
          <Badge variant="destructive" className="w-fit rounded-lg">
            {cameraError ?? geoError}
          </Badge>
        )}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-6 px-6 pt-6"
        style={{
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <Button
          type="button"
          size="icon"
          className="h-16 w-16 cursor-pointer rounded-full border-4 border-white bg-white/20 hover:bg-white/30"
          disabled={!isStreamReady}
          onClick={handleCapture}
        >
          <Camera className="h-7 w-7 text-white" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-12 w-12 cursor-pointer rounded-full bg-white/20 text-white hover:bg-white/30"
          disabled={!isStreamReady}
          onClick={handleSwitchCamera}
          title="Ganti kamera depan/belakang"
        >
          <SwitchCamera className="h-5 w-5" />
        </Button>
      </div>

      {!isStreamReady && !cameraError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
          <RotateCcw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Membuka kamera...</span>
        </div>
      )}
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const result: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      result.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) result.push(current);
  return result;
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: {
    timestampLabel: string;
    coordsLabel: string | null;
    addressLabel: string | null;
  },
) {
  const rawLines = [data.timestampLabel, data.coordsLabel, data.addressLabel].filter(
    (line): line is string => !!line,
  );
  if (rawLines.length === 0) return;

  const fontSize = Math.max(36, Math.round(width * 0.03));
  const padding = fontSize * 0.6;
  const lineHeight = fontSize * 1.4;
  const maxTextWidth = width - padding * 2;

  ctx.font = `${fontSize}px sans-serif`;

  const wrappedLines = rawLines.flatMap((line) =>
    wrapText(ctx, line, maxTextWidth),
  );

  const boxHeight = wrappedLines.length * lineHeight + padding * 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(0, height - boxHeight, width, boxHeight);

  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";

  wrappedLines.forEach((line, i) => {
    ctx.fillText(
      line,
      padding,
      height - boxHeight + padding + i * lineHeight,
    );
  });
}