'use client';

// Placeholder for TabSwitcher component
export default function TabSwitcher({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div>TabSwitcher</div>
      {children}
    </div>
  );
}
