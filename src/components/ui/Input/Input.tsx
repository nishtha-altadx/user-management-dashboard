import React from "react";

import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          {...props}
          className={`custom-input ${error ? "input-error" : ""}`}
        />

        {error && <p className="error-text">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
