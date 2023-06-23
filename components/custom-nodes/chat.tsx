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
      <div className="flex flex-col gap-2">
        <Message role={OpenAIRoles.ASSISTANT} content="Hello there!" />
        <Message role={OpenAIRoles.USER} content="Hi!" />

        <div className="flex gap-2">
          <Input placeholder="Type your message here" className="bg-white" />
          <Button>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </CustomNodeContainer>
  );
};

export default ChatNode;

export enum OpenAIRoles {
  USER = "user",
  ASSISTANT = "assistant",
}

type Props = {
  role: OpenAIRoles.USER | OpenAIRoles.ASSISTANT;
  content: string | React.ReactNode;
};

const Message = ({ role, content }: Props) => {
  return (
    <div
      className={`flex gap-1 px-1 py-2 bg-${
        role === OpenAIRoles.USER ? "white" : "gray-50"
      }`}
    >
      <span>{role === OpenAIRoles.ASSISTANT ? "🤖" : "👤"}</span>

      <p>{content}</p>
    </div>
  );
};
