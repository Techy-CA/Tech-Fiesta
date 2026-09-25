import { Link } from 'react-router-dom'
import { navigation, site } from '@/config/site'

export const Footer = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="footer__mark">{site.shortName}</div>

      <div className="footer__grid">
        <div className="footer__col footer__brand">
          <h4>The championship</h4>
          <p>{site.summary}</p>
        </div>

        <div className="footer__col">
          <h4>Sections</h4>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/control">Control desk</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Venue</h4>
          <ul>
            <li>
              <p>{site.venue}</p>
            </li>
            <li>
              <p>{site.city}</p>
            </li>
            <li>
              <p>{site.dateLabel}</p>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Operations</h4>
          <ul>
            <li>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
            <li>
              <a href={`tel:${site.contactPhone.replace(/\s/g, '')}`}>{site.contactPhone}</a>
            </li>
            <li>
              <a href={`https://${site.broadcast}`} target="_blank" rel="noreferrer">
                {site.broadcast}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>
          {site.name} {site.edition}
        </span>
        <span>{site.code}</span>
      </div>
    </div>
  </footer>
)
