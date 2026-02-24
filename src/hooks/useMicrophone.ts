import { useEffect, useState, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useApp } from "@/contexts";
import { fetchSTT } from "@/lib/functions";
import { shouldUsePluelyAPI } from "@/lib";
import type { VadConfig } from "./useSystemAudio";

// OPTIMIZED VAD defaults - matches backend exactly for perfect performance
const DEFAULT_VAD_CONFIG: VadConfig = {
  enabled: true,
  hop_size: 1024,
  sensitivity_rms: 0.012, // Much less sensitive - only real speech
  peak_threshold: 0.035, // Higher threshold - filters clicks/noise
  silence_chunks: 45, // ~1.0s of required silence
  min_speech_chunks: 7, // ~0.16s - captures short answers
  pre_speech_chunks: 12, // ~0.27s - enough to catch word start
  noise_gate_threshold: 0.003, // Stronger noise filtering
  max_recording_duration_secs: 180, // 3 minutes default
};

export type AudioSourceStatus = 'idle' | 'capturing' | 'processing' | 'error' | 'permission-denied';

export interface UseMicrophoneReturn {
  isCapturing: boolean;
  audioLevel: number;
  transcription: string;
  status: AudioSourceStatus;
  error?: string;
  isPermissionError: boolean;
  startCapture: () => Promise<void>;
  stopCapture: () => Promise<void>;
  checkPermission: () => Promise<boolean>;
  requestPermission: () => Promise<void>;
  deviceId: string;
  deviceName: string;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState<AudioSourceStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPermissionError, setIsPermissionError] = useState(false);
  const [vadConfig] = useState<VadConfig>(DEFAULT_VAD_CONFIG);

  const {
    selectedSttProvider,
    allSttProviders,
    selectedAudioDevices,
  } = useApp();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Get device info
  const deviceId = selectedAudioDevices.input.id;
  const deviceName = selectedAudioDevices.input.name;

  // Handle microphone speech detection event
  useEffect(() => {
    let speechUnlisten: (() => void) | undefined;

    const setupEventListener = async () => {
      try {
        speechUnlisten = await listen("microphone-speech-detected", async (event) => {
          try {
            if (!isCapturing) return;

            const base64Audio = event.payload as string;
            // Convert to blob
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes], { type: "audio/wav" });

            const usePluelyAPI = await shouldUsePluelyAPI();
            if (!selectedSttProvider.provider && !usePluelyAPI) {
              setError("No speech provider selected.");
              setStatus('error');
              return;
            }

            const providerConfig = allSttProviders.find(
              (p) => p.id === selectedSttProvider.provider
            );

            if (!providerConfig && !usePluelyAPI) {
              setError("Speech provider config not found.");
              setStatus('error');
              return;
            }

            setStatus('processing');

            // Add timeout wrapper for STT request (30 seconds)
            const sttPromise = fetchSTT({
              provider: providerConfig,
              selectedProvider: selectedSttProvider,
              audio: audioBlob,
            });

            const timeoutPromise = new Promise<string>((_, reject) => {
              setTimeout(
                () => reject(new Error("Speech transcription timed out (30s)")),
                30000
              );
            });

            try {
              const transcriptionText = await Promise.race([
                sttPromise,
                timeoutPromise,
              ]);

              if (transcriptionText.trim()) {
                setTranscription(transcriptionText);
                setError(undefined);
                setStatus('capturing');
              } else {
                setError("Received empty transcription");
                setStatus('error');
              }
            } catch (sttError: any) {
              console.error("STT Error:", sttError);
              setError(sttError.message || "Failed to transcribe audio");
              setStatus('error');
            }
          } catch (err) {
            setError("Failed to process speech");
            setStatus('error');
          }
        });
      } catch (err) {
        setError("Failed to setup speech listener");
        setStatus('error');
      }
    };

    setupEventListener();

    return () => {
      if (speechUnlisten) speechUnlisten();
    };
  }, [
    isCapturing,
    selectedSttProvider,
    allSttProviders,
  ]);

  // Handle audio level updates
  useEffect(() => {
    let levelUnlisten: (() => void) | undefined;

    const setupLevelListener = async () => {
      try {
        levelUnlisten = await listen("microphone-audio-level", (event) => {
          const level = event.payload as number;
          // Convert to 0-100 range
          setAudioLevel(Math.min(100, level * 100));
        });
      } catch (err) {
        console.error("Failed to setup audio level listener:", err);
      }
    };

    setupLevelListener();

    return () => {
      if (levelUnlisten) levelUnlisten();
    };
  }, []);

  // Handle error events
  useEffect(() => {
    let errorUnlisten: (() => void) | undefined;

    const setupErrorListener = async () => {
      try {
        errorUnlisten = await listen("microphone-audio-encoding-error", (event) => {
          const errorMsg = event.payload as string;
          console.error("Microphone audio encoding error:", errorMsg);
          setError(`Failed to process audio: ${errorMsg}`);
          setStatus('error');
        });
      } catch (err) {
        console.error("Failed to setup error listener:", err);
      }
    };

    setupErrorListener();

    return () => {
      if (errorUnlisten) errorUnlisten();
    };
  }, []);

  // Handle capture started/stopped events
  useEffect(() => {
    let startUnlisten: (() => void) | undefined;
    let stopUnlisten: (() => void) | undefined;

    const setupCaptureListeners = async () => {
      try {
        startUnlisten = await listen("microphone-capture-started", () => {
          setIsCapturing(true);
          setStatus('capturing');
        });

        stopUnlisten = await listen("microphone-capture-stopped", () => {
          setIsCapturing(false);
          setStatus('idle');
          setAudioLevel(0);
        });
      } catch (err) {
        console.error("Failed to setup capture listeners:", err);
      }
    };

    setupCaptureListeners();

    return () => {
      if (startUnlisten) startUnlisten();
      if (stopUnlisten) stopUnlisten();
    };
  }, []);

  const startCapture = useCallback(async () => {
    try {
      setError(undefined);
      setIsPermissionError(false);
      setTranscription("");
      setStatus('capturing');

      // Check permission first
      const hasAccess = await invoke<boolean>("check_microphone_access");
      if (!hasAccess) {
        setError("Microphone permission denied");
        setIsPermissionError(true);
        setStatus('permission-denied');
        setIsCapturing(false);
        return;
      }

      const deviceIdToUse =
        deviceId !== "default" ? deviceId : null;

      // Start capture with VAD config
      await invoke<string>("start_microphone_capture", {
        vadConfig: vadConfig,
        deviceId: deviceIdToUse,
      });

      setIsCapturing(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Detect permission-related errors
      const isPermError = 
        errorMessage.toLowerCase().includes("permission") ||
        errorMessage.toLowerCase().includes("access denied") ||
        errorMessage.toLowerCase().includes("not authorized");
      
      setError(errorMessage);
      setIsPermissionError(isPermError);
      setStatus(isPermError ? 'permission-denied' : 'error');
      setIsCapturing(false);
    }
  }, [vadConfig, deviceId]);

  const stopCapture = useCallback(async () => {
    try {
      // Abort any ongoing transcription requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Stop the audio capture
      await invoke<string>("stop_microphone_capture");

      // Reset states
      setIsCapturing(false);
      setStatus('idle');
      setAudioLevel(0);
      setError(undefined);
      setIsPermissionError(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to stop capture: ${errorMessage}`);
      setStatus('error');
      console.error("Stop capture error:", err);
    }
  }, []);

  // Check if microphone permission is granted
  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasAccess = await invoke<boolean>("check_microphone_access");
      if (!hasAccess) {
        setIsPermissionError(true);
        setStatus('permission-denied');
        setError("Microphone permission denied");
      } else {
        setIsPermissionError(false);
        if (status === 'permission-denied') {
          setStatus('idle');
          setError(undefined);
        }
      }
      return hasAccess;
    } catch (err) {
      console.error("Permission check failed:", err);
      return false;
    }
  }, [status]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    try {
      await invoke("request_microphone_access");
      
      // Wait a bit for user to grant permission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if permission was granted
      const hasAccess = await checkPermission();
      
      if (hasAccess) {
        // Try to start capture again
        await startCapture();
      }
    } catch (err) {
      console.error("Permission request failed:", err);
      setError("Failed to request permission. Please check system settings manually.");
    }
  }, [checkPermission, startCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      invoke("stop_microphone_capture").catch(() => {});
    };
  }, []);

  return {
    isCapturing,
    audioLevel,
    transcription,
    status,
    error,
    isPermissionError,
    startCapture,
    stopCapture,
    checkPermission,
    requestPermission,
    deviceId,
    deviceName,
  };
}
