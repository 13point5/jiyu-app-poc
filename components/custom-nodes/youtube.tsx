import Youtube from "react-youtube";
import CustomNodeContainer from "@/components/custom-nodes/container";
import { widths } from "@/app/constants";

const YoutubeNode = ({
  data,
}: {
  data: {
    id: string;
    name: string;
  };
}) => {
  return (
    <CustomNodeContainer type="youtube" title={data.name}>
      <Youtube
        videoId={data.id}
        opts={{
          width: `${widths.youtube - 24}`,
        }}
      />
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
