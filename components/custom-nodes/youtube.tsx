import Youtube from "react-youtube";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { widths, CustomNodeTypes } from "@/app/constants";

const nodeType = CustomNodeTypes.YOUTUBE;

const YoutubeNode = ({
  data,
}: {
  data: {
    id: string;
    name: string;
  };
}) => {
  return (
    <CustomNodeContainer type={nodeType} title={data.name}>
      <Youtube
        videoId={data.id}
        opts={{
          width: `${widths[nodeType] - 24}`,
        }}
      />
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
