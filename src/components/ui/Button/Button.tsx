import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger";
  type?: "button" | "submit";
}

export const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
