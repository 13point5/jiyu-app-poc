import { memo } from "react";
// import { Document, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/ReactFlow/constants";

import { Viewer } from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import "./Document.css";

function PDFNode({
  data,
  type,
}: {
  type: CustomNodeTypes;
  data: {
    name: string;
    path: string;
  };
}) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <CustomNodeContainer type={type} title={data.name}>
      {/* <Document file={data.path}>
        <Page pageNumber={1} width={widths[type] - 24} />
      </Document> */}

      <div
        style={{
          height: "500px",
        }}
        onPointerDown={(e) => {
          console.log("la");
          e.preventDefault();
        }}
        onSelect={() => {
          console.log("on select");
        }}
      >
        <Viewer
          fileUrl="/Learning_Theories_ Cognitivism.pdf"
          defaultScale={1}
          plugins={[defaultLayoutPluginInstance]}
        />
      </div>
    </CustomNodeContainer>
  );
}

export default memo(PDFNode);
