import { Loader } from "@/components/ui/loader";

export default function EditorLoading() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-background">
      <Loader size="lg" text="Loading Editor" />
    </div>
  );
}
