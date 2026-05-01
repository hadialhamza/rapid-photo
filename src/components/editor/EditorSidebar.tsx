import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { BackgroundPicker } from "@/components/editor/BackgroundPicker";
import { EnhanceToggle } from "@/components/editor/EnhanceToggle";
import { NoisewareToggle } from "@/components/editor/NoisewareToggle";
import { PhotoFormat } from "@/lib/constants/photo-formats";

interface EditorSidebarProps {
  selectedFormat: PhotoFormat;
  onFormatSelect: (format: PhotoFormat) => void;

  croppedImageUrl: string | null;

  isBgRemoved: boolean;
  bgProcessing: boolean;
  bgColor: string;
  onRemoveBg: () => void;
  onBgColorChange: (color: string) => void;
  onRestoreOriginal: () => void;

  isEnhanced: boolean;
  isEnhancing: boolean;
  onToggleEnhance: (state: boolean) => void;

  isSmoothed: boolean;
  isSmoothing: boolean;
  onToggleSmooth: (state: boolean) => void;

  onContinueToExport: () => void;
}

export function EditorSidebar({
  selectedFormat,
  onFormatSelect,
  croppedImageUrl,
  isBgRemoved,
  bgProcessing,
  bgColor,
  onRemoveBg,
  onBgColorChange,
  onRestoreOriginal,
  isEnhanced,
  isEnhancing,
  onToggleEnhance,
  isSmoothed,
  isSmoothing,
  onToggleSmooth,
  onContinueToExport,
}: EditorSidebarProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xs font-semibold uppercase text-muted mb-3">
          Target Format
        </h3>
        <FormatSelector
          selectedFormatId={selectedFormat.id}
          onSelect={onFormatSelect}
        />
      </section>

      {/* Background Settings — shown after crop */}
      {croppedImageUrl && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase text-muted">
              Background
            </h3>
            {isBgRemoved && (
              <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            )}
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
            {!isBgRemoved ? (
              <Button
                variant="default"
                className="w-full"
                onClick={onRemoveBg}
                disabled={bgProcessing}
                icon={<Sparkles className="h-4 w-4" />}
              >
                Remove Background
              </Button>
            ) : (
              <BackgroundPicker
                selectedFormat={selectedFormat}
                currentBgColor={bgColor}
                onBgColorChange={onBgColorChange}
                onRestoreOriginal={onRestoreOriginal}
              />
            )}
          </div>
        </section>
      )}

      {/* Enhance Toggle */}
      {croppedImageUrl && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300 flex flex-col gap-4">
          <EnhanceToggle
            isEnhanced={isEnhanced}
            onToggle={onToggleEnhance}
            isProcessing={isEnhancing && !isSmoothing}
          />
          <NoisewareToggle
            isSmoothed={isSmoothed}
            onToggle={onToggleSmooth}
            isProcessing={isSmoothing}
          />
        </section>
      )}

      {/* Export Action */}
      {croppedImageUrl && (
        <section className="pt-4 border-t border-border/50 animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
          <Button className="w-full" onClick={onContinueToExport}>
            Continue to Export
          </Button>
        </section>
      )}
    </div>
  );
}
