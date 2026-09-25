import { Link } from 'react-router-dom'
import { Arrow } from '@/components/ui/Arrow'

const NotFound = () => (
  <div className="wrap page">
    <div className="empty" style={{ border: 0 }}>
      <p className="eyebrow" style={{ justifyContent: 'center' }}>
        <span className="eyebrow__idx">404</span>
      </p>
      <h1 className="page__title">Off the bracket</h1>
      <p className="empty__note">
        That route does not exist. Head back to the overview and pick a section from the navigation.
      </p>
      <Link className="btn btn--primary" to="/">
        Return to overview
        <Arrow />
      </Link>
    </div>
  </div>
)

export default NotFound
