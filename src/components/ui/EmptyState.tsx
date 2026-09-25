interface EmptyStateProps {
  title: string
  note: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, note, action }: EmptyStateProps) => (
  <div className="empty">
    <p className="empty__title">{title}</p>
    <p className="empty__note">{note}</p>
    {action}
  </div>
)
