import { memo } from "react";
import { Document, Page } from "react-pdf";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes, widths } from "@/app/constants";

function WebsiteNode({
  data,
  type,
  id,
  ...restProps
}: {
  id: string;
  type: CustomNodeTypes;
  data: {
    name: string;
    url: string;
  };
}) {
  console.log({ data, restProps });
  return (
    <CustomNodeContainer type={type} title={data.name}>
      <iframe
        id={id}
        title={data.name}
        width="100%"
        height="700"
        src={data.url}
      ></iframe>
    </CustomNodeContainer>
  );
}

export default memo(WebsiteNode);
