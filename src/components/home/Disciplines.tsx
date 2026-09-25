import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { disciplines } from '@/config/site'

export const Disciplines = () => (
  <section className="section" id="disciplines">
    <div className="wrap">
      <SectionHead
        label="Disciplines"
        title="Four titles, one floor"
        note="The tactical shooter carries the trophy and the table. Everything else runs as a showcase between main stage fixtures."
      />

      <div className="listing">
        {disciplines.map((discipline, index) => (
          <Reveal key={discipline.title} delay={index * 60}>
            <article className="listing__row">
              <div>
                <h3 className="listing__name">{discipline.title}</h3>
                <p className="listing__desc">{discipline.detail}</p>
              </div>
              <div className="listing__side">
                <span className="tag">{discipline.mode}</span>
                <span className={index === 0 ? 'tag tag--signal' : 'tag'}>{discipline.stage}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)
