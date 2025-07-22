
import { Nav } from 'react-bootstrap';

const Sidebar = () => (
  <div
    className="p-3"
    style={{
      height: '100vh',
      width: '160px',
      minWidth: '120px',
      backgroundColor: '#0F172A',
      color: 'white',
    }}
  >
    <Nav defaultActiveKey="/companies" className="flex-column">
      <Nav.Link
        href="/companies"
        style={{ color: 'white', fontWeight: '500' }}
      >
        Companies
      </Nav.Link>
    </Nav>
  </div>
);

export default Sidebar;