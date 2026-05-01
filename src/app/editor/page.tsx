import type { Metadata } from "next";
import { EditorWorkspace } from "@/components/editor/EditorWorkspace";

export const metadata: Metadata = {
  title: "Photo Editor",
  description:
    "Upload your image, auto-crop to official guidelines, remove the background, and apply professional studio filters instantly right in your browser.",

  openGraph: {
    title: "Photo Editor | Rapid Photo",
    description:
      "Upload your image, auto-crop to official guidelines, and remove the background instantly.",
    url: "/editor",
    images: [
      {
        url: "https://res.cloudinary.com/djmfhatti/image/upload/v1777666975/rapid-photo.vercel.app_editor_1_jrlkiz.png",
        width: 1200,
        height: 630,
        alt: "Rapid Photo - Editor Interface",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Photo Editor | Rapid Photo",
    description:
      "Upload your image, auto-crop to official guidelines, and remove the background instantly.",
    images: [
      "https://res.cloudinary.com/djmfhatti/image/upload/v1777666975/rapid-photo.vercel.app_editor_1_jrlkiz.png",
    ],
  },
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { preset } = await searchParams;
  const presetId = typeof preset === "string" ? preset : undefined;

  return <EditorWorkspace initialPresetId={presetId} />;
}
