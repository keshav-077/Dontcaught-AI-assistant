import { useState } from "react";
import { TranscriptionDisplay } from "./TranscriptionDisplay";
import { Button } from "@/components/ui/button";

/**
 * Example component demonstrating TranscriptionDisplay usage
 * 
 * Features demonstrated:
 * - Empty state with placeholder
 * - Loading/processing state
 * - Text display with auto-scroll
 * - Copy-to-clipboard functionality
 */
export function TranscriptionDisplayExample() {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const addText = () => {
    setText((prev) => prev + "This is a new line of transcribed text. ");
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setText("Processing complete! Here is the transcribed text.");
    }, 2000);
  };

  const clearText = () => {
    setText("");
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-4">
      <h2 className="text-2xl font-bold">TranscriptionDisplay Example</h2>
      
      <div className="flex gap-2">
        <Button onClick={addText} size="sm">
          Add Text
        </Button>
        <Button onClick={simulateProcessing} size="sm" variant="secondary">
          Simulate Processing
        </Button>
        <Button onClick={clearText} size="sm" variant="outline">
          Clear
        </Button>
      </div>

      <div className="border rounded-lg h-64 overflow-hidden">
        <TranscriptionDisplay
          text={text}
          isProcessing={isProcessing}
          placeholder="Start transcribing to see text appear here..."
        />
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p><strong>Features:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Auto-scrolls to bottom as text is added</li>
          <li>Shows loading indicator during processing</li>
          <li>Displays placeholder when empty</li>
          <li>Copy button appears when text is present</li>
          <li>Handles long text with scrolling</li>
        </ul>
      </div>
    </div>
  );
}
