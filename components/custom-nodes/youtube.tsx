import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";

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
        style={{
          aspectRatio: "16/9",
          border: "0px",
        }}
        src={`https://www.youtube.com/embed/${data.id}?start=7&end=11;rel=0&amp;showinfo=0`}
        allowFullScreen
      ></iframe>
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
