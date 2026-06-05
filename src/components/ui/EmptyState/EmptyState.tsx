import "./EmptyState.css";

interface Props {
  title: string;
}

export const EmptyState = ({ title }: Props) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
    </div>
  );
};
