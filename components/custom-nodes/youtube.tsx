import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";

const getURL = (id: string, start?: number, end?: number) => {
  let url = `https://www.youtube.com/embed/${id}`;

  if (start || end) {
    url += "?";
  }

  if (start) {
    url += `&start=${Math.floor(start)}`;
  }

  // if (end) {
  //   url += `&end=${Math.ceil(end)}`;
  // }

  return url;
};

const YoutubeNode = ({
  data,
  type,
}: {
  type: CustomNodeTypes;
  data: {
    id: string;
    name: string;
    start?: number;
    end?: number;
  };
}) => {
  return (
    <CustomNodeContainer type={type} title={data.name}>
      <iframe
        style={{
          aspectRatio: "16/9",
          border: "0px",
        }}
        // src={`https://www.youtube.com/embed/${data.id}?start=7&end=11;rel=0&amp;showinfo=0`}
        src={getURL(data.id, data.start, data.end)}
        allowFullScreen
      ></iframe>
    </CustomNodeContainer>
  );
};

export default YoutubeNode;
