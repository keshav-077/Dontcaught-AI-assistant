import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AudioPane } from "./AudioPane";
import { DualPaneContainer } from "./DualPaneContainer";
import { HeadphonesIcon, MicIcon } from "lucide-react";

/**
 * Transcription Routing Tests
 * 
 * Validates Requirements 3.1, 3.2, 3.4:
 * - System audio transcriptions route to left pane
 * - Microphone transcriptions route to right pane
 * - Visual labels distinguish sources
 */
describe("Transcription Pane Routing", () => {
  it("should route system audio transcription to left pane", () => {
    const systemTranscription = "This is system audio transcription";
    
    const systemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={50}
        transcription={systemTranscription}
        status="capturing"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const micPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={false}
        audioLevel={0}
        transcription=""
        status="idle"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    const { container } = render(
      <DualPaneContainer
        systemAudioPane={systemPane}
        microphonePane={micPane}
      />
    );

    // Verify system audio pane is on the left (first child)
    const panes = container.querySelectorAll(".flex-1");
    expect(panes).toHaveLength(2);
    
    // First pane should contain system audio transcription
    expect(panes[0]).toHaveTextContent(systemTranscription);
    expect(panes[0]).toHaveTextContent("System Audio");
  });

  it("should route microphone transcription to right pane", () => {
    const micTranscription = "This is microphone transcription";
    
    const systemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={false}
        audioLevel={0}
        transcription=""
        status="idle"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const micPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={75}
        transcription={micTranscription}
        status="capturing"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    const { container } = render(
      <DualPaneContainer
        systemAudioPane={systemPane}
        microphonePane={micPane}
      />
    );

    // Verify microphone pane is on the right (second child)
    const panes = container.querySelectorAll(".flex-1");
    expect(panes).toHaveLength(2);
    
    // Second pane should contain microphone transcription
    expect(panes[1]).toHaveTextContent(micTranscription);
    expect(panes[1]).toHaveTextContent("Microphone");
  });

  it("should display both transcriptions independently", () => {
    const systemTranscription = "System audio content";
    const micTranscription = "Microphone content";
    
    const systemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={60}
        transcription={systemTranscription}
        status="capturing"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const micPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={80}
        transcription={micTranscription}
        status="capturing"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    const { container } = render(
      <DualPaneContainer
        systemAudioPane={systemPane}
        microphonePane={micPane}
      />
    );

    const panes = container.querySelectorAll(".flex-1");
    
    // Left pane has system audio only
    expect(panes[0]).toHaveTextContent(systemTranscription);
    expect(panes[0]).not.toHaveTextContent(micTranscription);
    
    // Right pane has microphone only
    expect(panes[1]).toHaveTextContent(micTranscription);
    expect(panes[1]).not.toHaveTextContent(systemTranscription);
  });

  it("should display visual labels to distinguish sources", () => {
    const systemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={false}
        audioLevel={0}
        transcription=""
        status="idle"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const micPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={false}
        audioLevel={0}
        transcription=""
        status="idle"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    render(
      <DualPaneContainer
        systemAudioPane={systemPane}
        microphonePane={micPane}
      />
    );

    // Verify both panes have clear labels
    expect(screen.getByText("System Audio")).toBeInTheDocument();
    expect(screen.getByText("Microphone")).toBeInTheDocument();
    
    // Verify source badges are present (Requirement 3.4)
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("should maintain correct routing when transcriptions update", () => {
    const initialSystemText = "Initial system";
    const initialMicText = "Initial mic";
    
    const systemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={50}
        transcription={initialSystemText}
        status="capturing"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const micPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={50}
        transcription={initialMicText}
        status="capturing"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    const { container, rerender } = render(
      <DualPaneContainer
        systemAudioPane={systemPane}
        microphonePane={micPane}
      />
    );

    // Verify initial state
    const panes = container.querySelectorAll(".flex-1");
    expect(panes[0]).toHaveTextContent(initialSystemText);
    expect(panes[1]).toHaveTextContent(initialMicText);

    // Update transcriptions
    const updatedSystemText = "Updated system audio";
    const updatedMicText = "Updated microphone";
    
    const updatedSystemPane = (
      <AudioPane
        title="System Audio"
        icon={<HeadphonesIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={50}
        transcription={updatedSystemText}
        status="capturing"
        deviceName="Default Output"
        audioSource="system-audio"
      />
    );

    const updatedMicPane = (
      <AudioPane
        title="Microphone"
        icon={<MicIcon className="h-4 w-4" />}
        isCapturing={true}
        audioLevel={50}
        transcription={updatedMicText}
        status="capturing"
        deviceName="Default Input"
        audioSource="microphone"
      />
    );

    rerender(
      <DualPaneContainer
        systemAudioPane={updatedSystemPane}
        microphonePane={updatedMicPane}
      />
    );

    // Verify routing is maintained after update
    expect(panes[0]).toHaveTextContent(updatedSystemText);
    expect(panes[1]).toHaveTextContent(updatedMicText);
  });
});
