"use client";

// import "@/lib/pdf";

import { Worker } from "@react-pdf-viewer/core";
import Draw from "@/app/Canvas/src";
// import Draw from "./reactFlow";

export default function Home() {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Draw />
    </Worker>
  );
}
