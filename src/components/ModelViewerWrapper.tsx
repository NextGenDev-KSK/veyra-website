"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader } from "./Loader";

// Client-only: the 3D canvas must never block first paint or run on the server.
const ClientCanvas = dynamic(() => import("./ModelViewerClient"), {
  ssr: false,
  loading: () => <Loader />,
});

export function ModelViewer() {
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<Loader />}>
        <ClientCanvas />
      </Suspense>
    </div>
  );
}
