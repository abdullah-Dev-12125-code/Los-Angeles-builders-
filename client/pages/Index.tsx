import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch demo data on component mount
  useEffect(() => {
    fetchDemo();
  }, []);

  // Fetch demo endpoint
  const fetchDemo = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/demo/`);
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching demo:", error);
      setApiError("Failed to load demo data");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-yellow-100">
      <div className="text-center">
        {/* TODO: FUSION_GENERATION_APP_PLACEHOLDER replace everything here with the actual app! */}
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-yellow-400"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-30"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
            />
            <circle
              className="text-yellow-500"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeDasharray="100"
              strokeDashoffset="75"
            />
          </svg>
          Generating your app...
        </h1>
        <p className="mt-4 text-gray-700 max-w-md">
          Watch the chat on the left for updates that might need your attention
          to finish generating
        </p>
        <p className="mt-4 hidden max-w-md">{exampleFromServer}</p>
      </div>
    </div>
  );
}
