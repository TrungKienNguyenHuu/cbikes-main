import styled from "styled-components";
import { useToast } from "../../context/ToastContext";
import { COLORS, SHADOWS } from "../../common/constants";

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
`;

interface ToastItemProps {
  type: "success" | "error" | "warning" | "info";
}

const getToastColors = (type: string) => {
  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    success: { bg: "#d4edda", border: COLORS.success, icon: "✓" },
    error: { bg: "#f8d7da", border: COLORS.error, icon: "✕" },
    warning: { bg: "#fff3cd", border: COLORS.warning, icon: "!" },
    info: { bg: "#d1ecf1", border: COLORS.info, icon: "ℹ" },
  };
  return colorMap[type] || colorMap.info;
};

const ToastItem = styled.div<ToastItemProps>`
  padding: 16px;
  background-color: ${(props) => getToastColors(props.type).bg};
  border-left: 4px solid ${(props) => getToastColors(props.type).border};
  border-radius: 4px;
  box-shadow: ${SHADOWS.md};
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 500px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

const ToastIcon = styled.span<{ $type: "success" | "error" | "warning" | "info" }>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => getToastColors(props.$type).border};
  flex-shrink: 0;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${COLORS.text};
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${COLORS.textLight};
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: ${COLORS.text};
  }
`;

export const ToastDisplay: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} type={toast.type}>
          <ToastIcon $type={toast.type}>
            {getToastColors(toast.type).icon}
          </ToastIcon>
          <ToastMessage>{toast.message}</ToastMessage>
          <CloseButton onClick={() => removeToast(toast.id)}>×</CloseButton>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};
