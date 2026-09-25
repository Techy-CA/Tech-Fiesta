import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { schedule, site } from '@/config/site'

export const Schedule = () => (
  <section className="section" id="schedule">
    <div className="wrap">
      <SectionHead
        label="Running order"
        title="Two days, gate to trophy"
        note={`All times are local to ${site.city}. The running order is held by the match officials and published again on the morning of each day.`}
      />

      <div className="timeline">
        {schedule.map((entry, index) => (
          <Reveal key={`${entry.day}-${entry.time}`} delay={index * 40}>
            <div className="timeline__row">
              <span className="timeline__time">
                {entry.day.replace('Day ', 'D')} {entry.time}
              </span>
              <span className="timeline__label">{entry.label}</span>
              <span className="timeline__note">{entry.note}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)
