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
        <div className="flex flex-col gap-0 mt-3">
          <Message role={OpenAIRoles.ASSISTANT} content="Hello there!" />
          <Message role={OpenAIRoles.USER} content="Hi!" isLast />
        </div>

        <div className="flex gap-2 mt-3">
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
  isLast?: boolean;
};

const Message = ({ role, content, isLast = false }: Props) => {
  return (
    <div className={`flex gap-3`}>
      <span>{role === OpenAIRoles.ASSISTANT ? "🤖" : "👤"}</span>

      <div className="w-full">
        <p>{content}</p>

        {!isLast && <div className=" bg-slate-300 h-[1px] w-full my-4"></div>}
      </div>
    </div>
  );
};
