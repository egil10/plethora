import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

const modalRootId = "modal-root";

const ensureModalRoot = () => {
  if (typeof document === "undefined") return null;
  let modalRoot = document.getElementById(modalRootId);
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", modalRootId);
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
};

export const Modal = ({ title, isOpen, onClose, children, footer }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const modalRoot = ensureModalRoot();
  if (!modalRoot) return null;

  const content = (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Lukk dialog">
            Lukk
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );

  return createPortal(content, modalRoot);
};

