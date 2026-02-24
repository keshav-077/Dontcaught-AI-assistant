import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSystemAudio } from "./useSystemAudio";
import { useMicrophone } from "./useMicrophone";
import type { AudioSourceStatus } from "./useMicrophone";
import { fetchAIResponse } from "@/lib/functions";
import { useApp } from "@/contexts";
import { shouldUsePluelyAPI, generateConversationId, generateMessageId, saveConversation, safeLocalStorage } from "@/lib";
import { DEFAULT_SYSTEM_PROMPT, STORAGE_KEYS } from "@/config";

export interface DualAudioState {
  // Overall state
  isOpen: boolean;
  isCapturing: boolean;
  
  // System audio state
  systemAudio: {
    isCapturing: boolean;
    audioLevel: number;
    transcription: string;
    status: AudioSourceStatus;
    error?: string;
    deviceId: string;
    deviceName: string;
  };
  
  // Microphone state
  microphone: {
    isCapturing: boolean;
    audioLevel: number;
    transcription: string;
    status: AudioSourceStatus;
    error?: string;
    deviceId: string;
    deviceName: string;
  };
}

export interface UseDualAudioReturn {
  // State
  state: DualAudioState;
  
  // Actions
  startCapture: () => Promise<void>;
  stopCapture: () => Promise<void>;
  toggleCapture: () => Promise<void>;
  processTranscriptions: () => Promise<void>;
  
  // Device management (with hot-swap support)
  selectSystemAudioDevice: (deviceId: string, deviceName?: string) => Promise<void>;
  selectMicrophoneDevice: (deviceId: string, deviceName?: string) => Promise<void>;
  
  // Permission management
  checkMicrophonePermission: () => Promise<boolean>;
  requestMicrophonePermission: () => Promise<void>;
  handleSystemAudioSetup: () => Promise<void>;
  
  // Popover control
  openInterface: () => void;
  closeInterface: () => void;
}

export function useDualAudio(): UseDualAudioReturn {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedAIProvider, allAiProviders, systemPrompt, selectedAudioDevices, setSelectedAudioDevices } = useApp();
  
  // Compose both audio hooks
  const systemAudio = useSystemAudio();
  const microphone = useMicrophone();

  // Load device selections from localStorage on mount
  useEffect(() => {
    const loadDeviceSelections = () => {
      try {
        const savedDevices = safeLocalStorage.getItem(STORAGE_KEYS.SELECTED_AUDIO_DEVICES);
        if (savedDevices) {
          const parsed = JSON.parse(savedDevices);
          if (parsed && typeof parsed === "object") {
            setSelectedAudioDevices(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load device selections:", error);
      }
    };

    loadDeviceSelections();
  }, [setSelectedAudioDevices]);

  // React to device changes from AudioSelection component
  // This ensures that when a user changes devices in the settings page,
  // the dual audio interface updates accordingly
  useEffect(() => {
    const handleDeviceChange = async () => {
      try {
        // If system audio device changed and we're currently capturing
        if (systemAudio.capturing && selectedAudioDevices.output.id) {
          const { invoke } = await import("@tauri-apps/api/core");
          try {
            const deviceIdToUse = selectedAudioDevices.output.id !== "default" 
              ? selectedAudioDevices.output.id 
              : null;
            await invoke("switch_system_audio_device", { deviceId: deviceIdToUse });
            console.log("System audio device updated from settings:", selectedAudioDevices.output.id);
          } catch (err) {
            console.error("Failed to apply system audio device change:", err);
          }
        }

        // If microphone device changed and we're currently capturing
        if (microphone.isCapturing && selectedAudioDevices.input.id) {
          const { invoke } = await import("@tauri-apps/api/core");
          try {
            const deviceIdToUse = selectedAudioDevices.input.id !== "default" 
              ? selectedAudioDevices.input.id 
              : null;
            await invoke("switch_microphone_device", { deviceId: deviceIdToUse });
            console.log("Microphone device updated from settings:", selectedAudioDevices.input.id);
          } catch (err) {
            console.error("Failed to apply microphone device change:", err);
          }
        }
      } catch (error) {
        console.error("Failed to handle device change:", error);
      }
    };

    handleDeviceChange();
  }, [selectedAudioDevices.input.id, selectedAudioDevices.output.id, systemAudio.capturing, microphone.isCapturing]);

  // Save device selections to localStorage
  const saveDeviceSelections = useCallback((devices: typeof selectedAudioDevices) => {
    try {
      safeLocalStorage.setItem(
        STORAGE_KEYS.SELECTED_AUDIO_DEVICES,
        JSON.stringify(devices)
      );
    } catch (error) {
      console.error("Failed to save device selections:", error);
    }
  }, []);

  // Synchronized start capture - starts both sources
  const startCapture = useCallback(async () => {
    try {
      // Start both captures in parallel
      await Promise.all([
        systemAudio.startCapture(),
        microphone.startCapture(),
      ]);
      
      // Open the interface
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to start dual audio capture:", err);
      // Even if one fails, the other might have started
      // Individual error states are handled by each hook
    }
  }, [systemAudio, microphone]);

  // Synchronized stop capture - stops both sources
  const stopCapture = useCallback(async () => {
    try {
      // Stop both captures in parallel
      await Promise.all([
        systemAudio.stopCapture(),
        microphone.stopCapture(),
      ]);
      
      // Close the interface
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to stop dual audio capture:", err);
      // Even if one fails, the other might have stopped
      // Individual error states are handled by each hook
    }
  }, [systemAudio, microphone]);

  // Toggle capture state
  const toggleCapture = useCallback(async () => {
    const isCurrentlyCapturing = systemAudio.capturing || microphone.isCapturing;
    
    if (isCurrentlyCapturing) {
      await stopCapture();
    } else {
      await startCapture();
    }
  }, [systemAudio.capturing, microphone.isCapturing, startCapture, stopCapture]);

  // Device selection functions with hot-swap support
  const selectSystemAudioDevice = useCallback(async (deviceId: string, deviceName?: string) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      
      // Get device name if not provided
      let finalDeviceName = deviceName;
      if (!finalDeviceName) {
        try {
          const devices = await invoke<Array<{ id: string; name: string }>>("get_output_devices");
          const device = devices.find(d => d.id === deviceId);
          finalDeviceName = device?.name || "System Audio Device";
        } catch (err) {
          console.error("Failed to get device name:", err);
          finalDeviceName = "System Audio Device";
        }
      }
      
      const newDevices = {
        ...selectedAudioDevices,
        output: { id: deviceId, name: finalDeviceName },
      };
      
      setSelectedAudioDevices(newDevices);
      saveDeviceSelections(newDevices);
      
      // If currently capturing, use hot-swap command
      if (systemAudio.capturing) {
        try {
          // Use the dedicated hot-swap command for seamless switching
          const deviceIdToUse = deviceId !== "default" ? deviceId : null;
          await invoke("switch_system_audio_device", { deviceId: deviceIdToUse });
          
          console.log("System audio device hot-swapped to:", deviceId);
        } catch (err) {
          console.error("Failed to hot-swap system audio device:", err);
          // Fallback: try manual restart
          try {
            await invoke("stop_system_audio_capture");
            await new Promise(resolve => setTimeout(resolve, 100));
            await systemAudio.startCapture();
          } catch (fallbackErr) {
            console.error("Fallback hot-swap also failed:", fallbackErr);
          }
        }
      } else {
        console.log("System audio device selected:", deviceId);
      }
    } catch (err) {
      console.error("Failed to select system audio device:", err);
    }
  }, [selectedAudioDevices, setSelectedAudioDevices, saveDeviceSelections, systemAudio]);

  const selectMicrophoneDevice = useCallback(async (deviceId: string, deviceName?: string) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      
      // Get device name if not provided
      let finalDeviceName = deviceName;
      if (!finalDeviceName) {
        try {
          const devices = await invoke<Array<{ id: string; name: string }>>("get_input_devices");
          const device = devices.find(d => d.id === deviceId);
          finalDeviceName = device?.name || "Microphone Device";
        } catch (err) {
          console.error("Failed to get device name:", err);
          finalDeviceName = "Microphone Device";
        }
      }
      
      const newDevices = {
        ...selectedAudioDevices,
        input: { id: deviceId, name: finalDeviceName },
      };
      
      setSelectedAudioDevices(newDevices);
      saveDeviceSelections(newDevices);
      
      // If currently capturing, use hot-swap command
      if (microphone.isCapturing) {
        try {
          // Use the dedicated hot-swap command for seamless switching
          const deviceIdToUse = deviceId !== "default" ? deviceId : null;
          await invoke("switch_microphone_device", { deviceId: deviceIdToUse });
          
          console.log("Microphone device hot-swapped to:", deviceId);
        } catch (err) {
          console.error("Failed to hot-swap microphone device:", err);
          // Fallback: try manual restart
          try {
            await invoke("stop_microphone_capture");
            await new Promise(resolve => setTimeout(resolve, 100));
            await microphone.startCapture();
          } catch (fallbackErr) {
            console.error("Fallback hot-swap also failed:", fallbackErr);
          }
        }
      } else {
        console.log("Microphone device selected:", deviceId);
      }
    } catch (err) {
      console.error("Failed to select microphone device:", err);
    }
  }, [selectedAudioDevices, setSelectedAudioDevices, saveDeviceSelections, microphone]);

  // Popover control
  const openInterface = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeInterface = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Process transcriptions and navigate to LLM response
  const processTranscriptions = useCallback(async () => {
    try {
      const systemAudioText = systemAudio.lastTranscription.trim();
      const microphoneText = microphone.transcription.trim();

      // Guard: prevent processing if both transcriptions are empty
      if (!systemAudioText && !microphoneText) {
        console.warn("Both transcriptions are empty, skipping LLM processing");
        return;
      }

      // Create a conversation for dual audio (using "chat" as source)
      const conversationId = generateConversationId("chat");
      const timestamp = Date.now();

      // Combine both transcriptions with source metadata
      const combinedContext = [
        systemAudioText && `[System Audio]: ${systemAudioText}`,
        microphoneText && `[Microphone]: ${microphoneText}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      // Check if we should use Pluely API
      const usePluelyAPI = await shouldUsePluelyAPI();
      
      if (!selectedAIProvider.provider && !usePluelyAPI) {
        console.error("No AI provider selected");
        return;
      }

      const provider = allAiProviders.find(
        (p) => p.id === selectedAIProvider.provider
      );

      if (!provider && !usePluelyAPI) {
        console.error("AI provider config not found");
        return;
      }

      // Create user message with dual context
      const userMessage = {
        id: generateMessageId("user", timestamp),
        role: "user" as const,
        content: combinedContext,
        timestamp,
      };

      // Start AI processing
      let fullResponse = "";
      
      for await (const chunk of fetchAIResponse({
        provider: usePluelyAPI ? undefined : provider,
        selectedProvider: selectedAIProvider,
        systemPrompt: systemPrompt || DEFAULT_SYSTEM_PROMPT,
        history: [],
        userMessage: combinedContext,
        imagesBase64: [],
      })) {
        fullResponse += chunk;
      }

      // Create assistant message
      const assistantMessage = {
        id: generateMessageId("assistant", timestamp + 1),
        role: "assistant" as const,
        content: fullResponse,
        timestamp: timestamp + 1,
      };

      // Save conversation
      const conversation = {
        id: conversationId,
        title: combinedContext.substring(0, 50) + "...",
        messages: [userMessage, assistantMessage],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await saveConversation(conversation);

      // Navigate to the response page
      navigate(`/chats/view/${conversationId}`);
    } catch (error) {
      console.error("Failed to process transcriptions:", error);
    }
  }, [
    systemAudio.lastTranscription,
    microphone.transcription,
    selectedAIProvider,
    allAiProviders,
    systemPrompt,
    navigate,
  ]);

  // Determine overall capturing state
  const isCapturing = systemAudio.capturing || microphone.isCapturing;

  // Determine system audio status
  const systemAudioStatus: AudioSourceStatus = systemAudio.setupRequired
    ? 'permission-denied'
    : systemAudio.error 
    ? 'error' 
    : systemAudio.isProcessing || systemAudio.isAIProcessing
    ? 'processing'
    : systemAudio.capturing
    ? 'capturing'
    : 'idle';

  // Build the dual audio state
  const state: DualAudioState = {
    isOpen,
    isCapturing,
    systemAudio: {
      isCapturing: systemAudio.capturing,
      audioLevel: 0, // System audio doesn't expose audio level yet
      transcription: systemAudio.lastTranscription,
      status: systemAudioStatus,
      error: systemAudio.error,
      deviceId: selectedAudioDevices.output.id,
      deviceName: selectedAudioDevices.output.name,
    },
    microphone: {
      isCapturing: microphone.isCapturing,
      audioLevel: microphone.audioLevel,
      transcription: microphone.transcription,
      status: microphone.status,
      error: microphone.error,
      deviceId: microphone.deviceId,
      deviceName: microphone.deviceName,
    },
  };

  return {
    state,
    startCapture,
    stopCapture,
    toggleCapture,
    processTranscriptions,
    selectSystemAudioDevice,
    selectMicrophoneDevice,
    checkMicrophonePermission: microphone.checkPermission,
    requestMicrophonePermission: microphone.requestPermission,
    handleSystemAudioSetup: systemAudio.handleSetup,
    openInterface,
    closeInterface,
  };
}
