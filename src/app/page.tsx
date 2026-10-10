import DashboardFlow from "@/components/flow/dashboard-flow";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agency Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real estate management overview
        </p>
      </header>
      <main className="flex-1 overflow-hidden">
        <DashboardFlow />
      </main>
    </div>
  );
}
