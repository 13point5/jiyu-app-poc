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
      <iframe
        width="300"
        // height="720"
        src="https://www.youtube.com/embed/lGaQWIV8PZ4?start=7&end=11;rel=0&amp;showinfo=0"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      {/* <Youtube
        videoId={data.id}
        opts={{
          width: `${widths[type] - 24}`,
        }}
      /> */}
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
