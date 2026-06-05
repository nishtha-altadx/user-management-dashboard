import "./Input.css";

interface InputProps {
  value: string;
  placeholder?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const Input = ({
  value,
  placeholder,
  onChange,
}: InputProps) => {
  return (
    <input
      className="custom-input"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};