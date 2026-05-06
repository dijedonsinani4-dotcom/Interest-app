import { MemberHeader } from "@/components/member-header";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MemberHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
