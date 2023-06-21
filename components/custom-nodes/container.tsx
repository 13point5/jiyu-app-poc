import { widths, icons, CustomNodeTypes } from "@/app/constants";

const CustomNodeContainer = ({
  children,
  type,
  title,
}: {
  children: React.ReactNode;
  type: CustomNodeTypes;
  title: string;
}) => {
  const Icon = icons[type];

  return (
    <div
      className="flex flex-col gap-4 bg-slate-200 p-4 rounded-md"
      style={{
        width: `${widths[type] + 8}px`,
      }}
    >
      <div className="flex flex-row gap-2">
        <Icon size={24} />

        <p className="">{title}</p>
      </div>

      {children}
    </div>
  );
};

export default CustomNodeContainer;
