"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// import "@/lib/pdf";

// import { Worker } from "@react-pdf-viewer/core";
// import Draw from "@/app/HardWay";
// import Draw from "./ReactFlow";

// export default function Home() {
//   return (
//     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//       <Draw />
//     </Worker>
//   );
// }

import AuthForm from "./auth-form";

export default function Home() {
  return (
    <main className="">
      <section className="w-full flex flex-col gap-4 items-center p-4">
        <h1 className="text-5xl font-bold">Jiyu</h1>

        <Link href={"/login"}>
          <Button variant="default">Login</Button>
        </Link>

        <p>homepage</p>
      </section>
    </main>
  );
  // return (
  //   <div className="row">
  //     <div className="col-6 auth-widget">
  //       <AuthForm />
  //     </div>
  //   </div>
  // );
}
