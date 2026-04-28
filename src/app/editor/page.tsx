import { EditorWorkspace } from "@/components/editor/EditorWorkspace";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { preset } = await searchParams;
  const presetId = typeof preset === "string" ? preset : undefined;

  return <EditorWorkspace initialPresetId={presetId} />;
}
