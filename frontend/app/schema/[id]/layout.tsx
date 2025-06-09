export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-[#fcfbfc] min-h-[calc(100vh)]">
      {children}
    </div>
  );
}
