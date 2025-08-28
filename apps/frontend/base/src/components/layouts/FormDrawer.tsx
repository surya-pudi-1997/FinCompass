import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

const FormDrawer: React.FC<FormDrawerProps> = ({
  isOpen,
  onClose,
  header,
  body,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          {header && <div className="flex-shrink-0 border-b">{header}</div>}

          {/* Default Header with Close Button if no custom header provided */}
          {!header && (
            <div className="flex-shrink-0 flex items-center justify-end p-4 border-b">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">{body}</div>

          {/* Footer - Fixed */}
          {footer && (
            <div className="flex-shrink-0 border-t bg-background">{footer}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormDrawer;
