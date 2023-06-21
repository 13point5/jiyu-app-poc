import Youtube from "react-youtube";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { widths, CustomNodeTypes } from "@/app/constants";

const YoutubeNode = ({
  data,
  type,
}: {
  type: CustomNodeTypes;
  data: {
    id: string;
    name: string;
  };
}) => {
  return (
    <CustomNodeContainer type={type} title={data.name}>
      <Youtube
        videoId={data.id}
        opts={{
          width: `${widths[type] - 24}`,
        }}
      />
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
