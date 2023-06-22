"use client";

import "./pdf";

// import Draw from "@/app/tldraw";

import dynamic from "next/dynamic";

const Editor = dynamic(async () => import("./tldraw"), { ssr: false });

export default function Home() {
  return <Editor />;
}
