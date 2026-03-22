import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome Back 👋</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Videos Created" value="0" />
        <StatCard title="Monthly Credits" value="0/5" />
        <StatCard title="Processing Jobs" value="0" />
        <StatCard title="Storage Used" value="0 GB" />
      </div>
    </div>
  );
}
