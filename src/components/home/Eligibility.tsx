import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { eligibility } from '@/config/site'

export const Eligibility = () => (
  <section className="section" id="rules">
    <div className="wrap">
      <SectionHead
        label="Eligibility and conduct"
        title={
          <>
            Read this <em>before</em> you register
          </>
        }
        note="Six rules decide whether an entry stands. Everything else is handled by the officials on site."
      />

      <div className="listing listing--rules">
        {eligibility.map((rule, index) => (
          <Reveal key={rule} delay={index * 60} variant="up">
            <div className="listing__row listing__row--rule">
              <p className="listing__rule">{rule}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)
