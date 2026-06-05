import "./Toast.css";

interface ToastProps {
  message: string;
  type?: "success" | "error";
}

export const Toast = ({ message, type = "success" }: ToastProps) => {
  return <div className={`toast toast-${type}`}>{message}</div>;
};
