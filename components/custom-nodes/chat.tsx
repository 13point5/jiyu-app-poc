import CustomNodeContainer from "@/components/custom-nodes/container";
import { CustomNodeTypes } from "@/app/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const nodeType = CustomNodeTypes.CHAT;

const ChatNode = ({
  data,
}: {
  data: {
    id: string;
    name: string;
  };
}) => {
  return (
    <CustomNodeContainer type={nodeType} title={data.name}>
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
