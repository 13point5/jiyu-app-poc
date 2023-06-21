import { memo } from "react";
import { Document, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/constants";

const nodeType = CustomNodeTypes.YOUTUBE;

function PDFNode({
  data,
}: {
  id: string;
  selected: boolean;
  data: {
    name: string;
    path: string;
  };
}) {
  return (
    <CustomNodeContainer type={nodeType} title={data.name}>
      <Document file={data.path}>
        <Page pageNumber={1} width={widths[nodeType] - 24} />
      </Document>
    </CustomNodeContainer>
  );
}

export default memo(PDFNode);
