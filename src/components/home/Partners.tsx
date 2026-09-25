import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { partners } from '@/config/site'

export const Partners = () => (
  <section className="section" id="partners">
    <div className="wrap">
      <SectionHead
        label="Partners"
        title="Who puts the floor together"
        note="Hardware, connectivity, production and venue are covered by the partners below."
      />

      <Reveal>
        <div className="partners">
          {partners.map((partner) => (
            <div className="partners__cell" key={partner.name}>
              <span className="partners__name">{partner.name}</span>
              <span className="partners__tier">{partner.tier}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
)
