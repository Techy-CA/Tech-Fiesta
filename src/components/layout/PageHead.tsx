interface PageHeadProps {
  label: string
  title: string
  lede?: string
  aside?: React.ReactNode
}

export const PageHead = ({ label, title, lede, aside }: PageHeadProps) => (
  <div className="page__head">
    <div>
      <p className="eyebrow">
        <span className="eyebrow__idx">//</span>
        {label}
      </p>
      <h1 className="page__title">{title}</h1>
      {lede ? <p className="page__lede">{lede}</p> : null}
    </div>
    {aside ? <div className="row">{aside}</div> : null}
  </div>
)
