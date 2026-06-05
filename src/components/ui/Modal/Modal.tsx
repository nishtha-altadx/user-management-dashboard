import "./Modal.css";

interface Props {
  open: boolean;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ open, title, children }: Props) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{title}</h2>

        {children}
      </div>
    </div>
  );
};
