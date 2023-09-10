import { memo } from "react";
import { Document, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/ReactFlow/constants";

function PDFNode({
  data,
  type,
  className = "",
  ...restProps
}: {
  className?: string;
  type: CustomNodeTypes;
  data: {
    name: string;
    path: string;
  };
}) {
  return (
    <CustomNodeContainer type={type} title={data.name} className={className}>
      <Document file={data.path}>
        <Page pageNumber={1} width={widths[type] - 24} />
      </Document>
    </CustomNodeContainer>
  );
}

export default memo(PDFNode);
