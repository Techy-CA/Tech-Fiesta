import { Reveal } from '@/components/ui/Reveal'

interface SectionHeadProps {
  label: string
  title: React.ReactNode
  note?: string
}

export const SectionHead = ({ label, title, note }: SectionHeadProps) => (
  <div className="section__head">
    <Reveal variant="up">
      <p className="eyebrow">
        <span className="eyebrow__idx">//</span>
        {label}
      </p>
      <h2 className="section__title">{title}</h2>
    </Reveal>
    {note ? (
      <Reveal variant="up" delay={120}>
        <p className="section__note">{note}</p>
      </Reveal>
    ) : null}
  </div>
)
