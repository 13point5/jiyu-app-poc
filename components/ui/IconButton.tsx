import { Button } from "@/components/ui/button";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
};

export default function IconButton({
  onClick,
  children,
  isActive,
  disabled,
}: Props) {
  return (
    <Button
      className={`text-slate-500 hover:text-slate-700 hover:bg-slate-300 ${
        isActive &&
        "text-blue-600 decoration-blue-600 hover:text-blue-600 hover:decoration-blue-600"
      }`}
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
