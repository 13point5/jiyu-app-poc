import { memo } from "react";
import { Document, Page } from "react-pdf";
import { FileText } from "lucide-react";

const FIXED_WIDTH = 300;

function PDFNode({
  id,
  data,
  selected,
}: {
  id: string;
  selected: boolean;
  data: {
    name: string;
    path: string;
  };
}) {
  return (
    <>
      <div
        className="flex flex-col gap-4 bg-slate-50 p-4 rounded-md"
        style={{
          width: `${FIXED_WIDTH + 8}px`,
        }}
      >
        <div className="flex flex-row gap-2 align-middle">
          <FileText />

          <p className="">{data.name}</p>
        </div>

        <Document file={data.path}>
          <Page pageNumber={1} width={FIXED_WIDTH - 24} />
        </Document>
      </div>
    </>
  );
}

export default memo(PDFNode);
