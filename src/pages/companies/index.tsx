import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Topbar from '../../components/Topbar';
import Sidebar from '../../components/Sidebar';
import CompanyModal from '../../components/modal/CompanyModal';

interface Company {
  id?: number;
  companyName: string;
  integrations: any[];
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company>({
    companyName: '',
    integrations: [],
  });

  const fetchCompanies = async () => {
    const res = await fetch('http://localhost:5000/companies');
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAdd = () => {
    setCurrentCompany({ companyName: '', integrations: [] });
    setModalVisible(true);
  };

  const handleEdit = (company: Company) => {
    setCurrentCompany(company);
    setModalVisible(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await fetch(`http://localhost:5000/companies/${id}`, { method: 'DELETE' });
    fetchCompanies();
  };

  const handleSave = async (company: Company) => {
    if (company.id) {
      await fetch(`http://localhost:5000/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });
    } else {
      await fetch('http://localhost:5000/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });
    }
    setModalVisible(false);
    fetchCompanies();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Topbar />
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', width: '100%' }}>
        <div className="d-flex justify-content-between mb-3">
          <h2>Companies</h2>
          <Button onClick={handleAdd}>+ Add Company</Button>
        </div>

          <Table
  className="table-borderless"
  style={{
    background: '#0F172A',
    color: 'white',
    fontWeight: 500,
    borderRadius: 8,
    overflow: 'hidden',
  }}
>
  <thead>
    <tr style={{ background: '#0F172A', color: 'white' }}>
      <th>Name</th>
      <th>Integrations</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {companies.map((company) => (
      <tr key={company.id} style={{ background: '#0F172A', color: 'white' }}>
        <td>{company.companyName}</td>
       <td>
          {company.integrations && company.integrations.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {company.integrations.map((integration: any) => (
                <span
                  key={integration.integrationName}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={integration.integrationLogo}
                    alt={integration.integrationName}
                    style={{ width: 24, height: 24, objectFit: 'contain' }}
                  />
                </span>
              ))}
            </div>
          ) : (
            <span style={{ color: '#888' }}>None</span>
          )}
        </td>
        <td>
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            style={{ fontWeight: 500 }}
            onClick={() => handleEdit(company)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            style={{ fontWeight: 500 }}
            onClick={() => handleDelete(company.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

          <CompanyModal
            show={modalVisible}
            onHide={() => setModalVisible(false)}
            onSave={handleSave}
            initialValues={currentCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;