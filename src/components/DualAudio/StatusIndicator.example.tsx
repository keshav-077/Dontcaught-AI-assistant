import { StatusIndicator, AudioSourceStatus } from "./StatusIndicator";

export function StatusIndicatorExample() {
  const statuses: AudioSourceStatus[] = [
    "idle",
    "capturing",
    "processing",
    "error",
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">StatusIndicator Examples</h2>

      {/* All status types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Status Types</h3>
        <div className="flex items-center gap-8">
          {statuses.map((status) => (
            <div key={status} className="flex flex-col items-center gap-2">
              <StatusIndicator status={status} />
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* With custom messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Custom Messages</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <StatusIndicator
              status="capturing"
              message="Recording from microphone at 48kHz"
            />
            <span className="text-sm text-gray-600">Custom message</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <StatusIndicator
              status="error"
              message="Microphone permission denied. Please grant access in system settings."
            />
            <span className="text-sm text-gray-600">Error with details</span>
          </div>
        </div>
      </div>

      {/* In context */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">In Audio Pane Context</h3>
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">System Audio</span>
              <StatusIndicator status="capturing" />
            </div>
            <span className="text-sm text-gray-500">Device: Speakers</span>
          </div>
          <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400">Audio Visualization</span>
          </div>
        </div>
      </div>

      {/* Hover instruction */}
      <div className="text-sm text-gray-600 italic">
        Hover over any status indicator to see the tooltip with detailed
        information.
      </div>
    </div>
  );
}
