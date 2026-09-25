interface NoticeProps {
  tone?: 'neutral' | 'error' | 'ok'
  children: React.ReactNode
}

export const Notice = ({ tone = 'neutral', children }: NoticeProps) => (
  <p className={tone === 'neutral' ? 'notice' : `notice notice--${tone}`} role={tone === 'error' ? 'alert' : undefined}>
    {children}
  </p>
)
