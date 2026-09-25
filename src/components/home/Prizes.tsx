import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { prizes, site } from '@/config/site'
import { ordinal } from '@/lib/format'

export const Prizes = () => (
  <section className="section" id="prizes">
    <div className="wrap">
      <SectionHead
        label="Prize distribution"
        title={`${site.currency} ${site.prizePool} on the table`}
        note="Prize money is transferred to the squad captain within fourteen working days of the presentation. Splits inside a squad are the squad's business."
      />

      <div className="split split--7-5">
        <Reveal>
          <div className="prize">
            {prizes.map((prize) => (
              <div className="prize__row" data-tier={prize.tier} key={prize.place}>
                <div>
                  <p className="prize__place">
                    {prize.place}
                    <small>{ordinal(prize.tier)}</small>
                  </p>
                  <p className="listing__desc">{prize.note}</p>
                </div>
                <p className="prize__amount">
                  {site.currency} {prize.amount}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="panel">
            <div className="panel__head">
              <span>Beyond the cash</span>
              <span className="tag tag--signal">All qualifiers</span>
            </div>
            <div className="panel__body stack">
              <p className="listing__desc">
                Every squad that reaches the playoffs receives a full broadcast package: vod archive,
                match statistics and a production reel cut by the partner studio.
              </p>
              <p className="listing__desc">
                The champion carries the trophy and an automatic slot in the next open season, which
                removes the qualifier stage entirely for that roster.
              </p>
              <p className="listing__desc">
                Most valuable player is decided by the broadcast desk across the two days and
                announced at the presentation.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
)
