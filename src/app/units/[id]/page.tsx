import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import UnitDetailFlow from "@/components/flow/unit-detail-flow";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Unit Details</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage tenants, amenities, and processes
              </p>
            </div>
          </div>
          <Link
            href={`/units/${id}/agent`}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <MessageSquare className="h-4 w-4" />
            Chat with Agent
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <UnitDetailFlow unitId={id} />
      </main>
    </div>
  );
}
