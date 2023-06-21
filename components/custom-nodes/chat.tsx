import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const ChatNode = ({
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
      <div className="flex gap-2">
        <Input placeholder="Type your message here" className="bg-white" />
        <Button>
          <Send size={16} />
        </Button>
      </div>
    </CustomNodeContainer>
  );
};

export default ChatNode;
