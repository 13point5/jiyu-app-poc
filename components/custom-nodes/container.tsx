import {
  widths,
  icons,
  CustomNodeTypes,
  bgColors,
} from "@/app/ReactFlow/constants";

import { cn } from "@/lib/utils";

const CustomNodeContainer = ({
  children,
  type,
  title,
  className,
}: {
  children: React.ReactNode;
  type: CustomNodeTypes;
  title?: string;
  className?: string;
}) => {
  const Icon = icons[type];

  return (
    <div
      style={{
        width: `${widths[type] + 8}px`,
        minHeight: "300px",
        maxHeight: "600px",
      }}
      className={cn(
        `flex flex-col gap-4 ${
          bgColors[type] || "bg-slate-100"
        } p-4 rounded-md shadow-md`,
        className
      )}
    >
      <div className="flex flex-row gap-2">
        <Icon size={24} />

        <p>{title}</p>
      </div>

      {children}
    </div>
  );
};

export default CustomNodeContainer;
