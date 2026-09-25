import { useState } from 'react'
import { SectionHead } from '@/components/layout/SectionHead'
import { faqs } from '@/config/site'

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <SectionHead
          label="Questions"
          title="The things captains ask"
          note="If the answer is not here, operations replies to email inside one working day."
        />

        <div className="faq">
          {faqs.map((item, index) => {
            const expanded = open === index

            return (
              <div className="faq__item" data-open={expanded} key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    {item.q}
                    <span className="faq__sign" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faq__a"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
