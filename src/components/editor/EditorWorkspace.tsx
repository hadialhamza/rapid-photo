"use client";

import React from "react";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { FinalPreview } from "@/components/editor/FinalPreview";
import { PrintLayoutCart } from "@/components/editor/PrintLayoutCart";
import { useEditorWorkspace } from "./hooks/useEditorWorkspace";
import { EditorMain } from "./workspace/EditorMain";

interface EditorWorkspaceProps {
  initialPresetId?: string;
}

export function EditorWorkspace({ initialPresetId }: EditorWorkspaceProps) {
  const {
    selectedFormat,
    setSelectedFormat,
    step,
    setStep,
    uploadedImageUrl,
    croppedImageUrl,
    previewSrc,
    faceResult,
    cropArea,
    imageSize,
    detectionError,
    isBgRemoved,
    bgProcessing,
    bgColor,
    loadingMsgIndex,
    isEnhanced,
    isEnhancing,
    isSmoothed,
    isSmoothing,
    finalImageUrl,
    unenhancedImageUrl,
    handleImageLoaded,
    handleStartOver,
    handleCropComplete,
    handleRemoveBg,
    handleBgColorChange,
    handleRestoreOriginal,
    handleToggleEnhance,
    handleToggleSmooth,
  } = useEditorWorkspace(initialPresetId);

  return (
    <>
      <PrintLayoutCart />
      <div className="min-h-[80vh] w-full bg-background">
        <div className="container mx-auto px-4 py-8">
          {!step.includes("export") && (
            <EditorToolbar
              selectedFormat={selectedFormat}
              showStartOver={!!uploadedImageUrl}
              onStartOver={handleStartOver}
            />
          )}

          {step === "export" && previewSrc && uploadedImageUrl ? (
            <FinalPreview
              originalImageUrl={croppedImageUrl || uploadedImageUrl}
              finalImageUrl={previewSrc}
              selectedFormat={selectedFormat}
              onBack={() => setStep("upload")}
              onStartOver={handleStartOver}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <EditorSidebar
                  selectedFormat={selectedFormat}
                  onFormatSelect={setSelectedFormat}
                  croppedImageUrl={croppedImageUrl}
                  isBgRemoved={isBgRemoved}
                  bgProcessing={bgProcessing}
                  bgColor={bgColor}
                  onRemoveBg={handleRemoveBg}
                  onBgColorChange={handleBgColorChange}
                  onRestoreOriginal={handleRestoreOriginal}
                  isEnhanced={isEnhanced}
                  isEnhancing={isEnhancing}
                  onToggleEnhance={handleToggleEnhance}
                  isSmoothed={isSmoothed}
                  isSmoothing={isSmoothing}
                  onToggleSmooth={handleToggleSmooth}
                  onContinueToExport={() => setStep("export")}
                />
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                <EditorMain
                  step={step}
                  setStep={setStep}
                  uploadedImageUrl={uploadedImageUrl}
                  croppedImageUrl={croppedImageUrl}
                  previewSrc={previewSrc}
                  faceResult={faceResult}
                  cropArea={cropArea}
                  imageSize={imageSize}
                  detectionError={detectionError}
                  selectedFormat={selectedFormat}
                  isBgRemoved={isBgRemoved}
                  bgProcessing={bgProcessing}
                  loadingMsgIndex={loadingMsgIndex}
                  isEnhanced={isEnhanced}
                  isSmoothed={isSmoothed}
                  finalImageUrl={finalImageUrl}
                  unenhancedImageUrl={unenhancedImageUrl}
                  handleImageLoaded={handleImageLoaded}
                  handleCropComplete={handleCropComplete}
                  handleStartOver={handleStartOver}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
