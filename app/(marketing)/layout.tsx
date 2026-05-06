import { AppAmbienceLayers } from "@/components/member-page-shell";
import { MarketingHeader } from "@/components/marketing-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden">
      <AppAmbienceLayers />
      <MarketingHeader />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
