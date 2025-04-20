"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [entities, setEntities] = useState<string[]>([]);

  useEffect(() => {
    // Load entity list from genesis.json
    // This is a placeholder - in a real implementation, we'd fetch from genesis.json
    const appEntities = ["home", "about"];
    setEntities(appEntities);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Genesis App
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This is a Next.js application with Tailwind CSS, Zustand for state management,
          and a module pattern for API and business logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Entities</h2>
          <ul className="space-y-2">
            {entities.map((entity) => (
              <li key={entity} className="text-blue-500 hover:text-blue-700">
                <Link href={`/${entity}`}>{entity.charAt(0).toUpperCase() + entity.slice(1)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Development</h2>
          <p className="text-gray-600 mb-4">
            Refer to the <code className="bg-gray-100 px-1 py-0.5 rounded">.cursorrules</code> file
            for coding standards and best practices.
          </p>
          <p className="text-gray-600">
            This application follows a modular architecture with:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Zustand stores for state management</li>
            <li>API modules for backend interactions</li>
            <li>TypeScript for type safety</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Next.js with App Router</li>
            <li>Tailwind CSS for styling</li>
            <li>PWA support for offline access</li>
            <li>Modular architecture</li>
            <li>TypeScript for type safety</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
