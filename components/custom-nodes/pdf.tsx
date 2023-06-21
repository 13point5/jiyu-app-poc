import { memo } from "react";
import { Document, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/constants";

function PDFNode({
  data,
  type,
  ...restProps
}: {
  type: CustomNodeTypes;
  data: {
    name: string;
    path: string;
  };
}) {
  console.log({ data, restProps });
  return (
    <CustomNodeContainer type={type} title={data.name}>
      <Document file={data.path}>
        <Page pageNumber={1} width={widths[type] - 24} />
      </Document>
    </CustomNodeContainer>
  );
}

export default memo(PDFNode);
