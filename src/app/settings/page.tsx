"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setIsConfigured(data.configured ?? false);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSaving(true);
    setSaveMessage("");
    setTestResult(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      if (res.ok) {
        setIsConfigured(true);
        setApiKey("");
        setSaveMessage("API key saved successfully.");
      } else {
        const error = await res.json().catch(() => ({ error: "Failed to save" }));
        setSaveMessage(`Error: ${error.error || "Failed to save"}`);
      }
    } catch {
      setSaveMessage("Error: Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/settings/test", {
        method: "POST",
      });

      const data = await res.json();
      setTestResult({
        success: res.ok,
        message: data.message || data.error || "Unknown result",
      });
    } catch {
      setTestResult({
        success: false,
        message: "Failed to test connection.",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          API Configuration
        </h2>

        <div className="mb-6 flex items-center gap-2">
          {isConfigured ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                API Key: Configured
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">
                API Key: Not Set
              </span>
            </>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={isConfigured ? "Enter new key to update..." : "sk-ant-..."}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !apiKey.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !isConfigured}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {testing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Test Connection
            </button>
          </div>
        </form>

        {saveMessage && (
          <p
            className={`mt-4 text-sm ${
              saveMessage.startsWith("Error")
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {saveMessage}
          </p>
        )}

        {testResult && (
          <div
            className={`mt-4 rounded-md p-3 text-sm ${
              testResult.success
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {testResult.message}
          </div>
        )}
      </div>
    </div>
  );
}
