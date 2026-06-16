import { PageHeader } from "@/Component/ui/primitives";
import { ReactNode } from "react";

type AdminPageShellProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AdminPageShell({
  title,
  description,
  eyebrow,
  actions,
  children,
  className = "",
}: AdminPageShellProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={actions}
        />
      )}
      {children}
    </div>
  );
}
