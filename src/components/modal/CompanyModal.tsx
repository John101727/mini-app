import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface Integration {
  integrationName: string;
  integrationLogo: string;
}

interface Company {
  id?: number;
  companyName: string;
  integrations: Integration[];
}

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: (company: Company) => void;
  initialValues: Company;
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    integrationName: 'Google Cloud',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/google-cloud.png',
  },
  {
    integrationName: 'Bitbucket',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/bitbucket.png',
  },
  {
    integrationName: 'Jira',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/jira.png',
  },
  {
    integrationName: 'Trello',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/trello.png',
  },
  {
    integrationName: 'Oracle',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/oracle-logo.png',
  },
  {
    integrationName: 'Microsoft',
    integrationLogo: 'https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/microsoft-office.png',
  },
];

const CompanyModal = ({ show, onHide, onSave, initialValues }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      companyName: Yup.string().required('Company name is required'),
      integrations: Yup.array().of(
        Yup.object({
          integrationName: Yup.string().required(),
          integrationLogo: Yup.string().required(),
        })
      ),
    }),
    onSubmit: (values) => {
      onSave(values);
    },
  });

  const isSelected = (integration: Integration) =>
    formik.values.integrations.some(
      (i) => i.integrationName === integration.integrationName
    );

  const handleIntegrationChange = (integration: Integration) => {
    if (isSelected(integration)) {
      formik.setFieldValue(
        'integrations',
        formik.values.integrations.filter(
          (i) => i.integrationName !== integration.integrationName
        )
      );
    } else {
      formik.setFieldValue('integrations', [
        ...formik.values.integrations,
        integration,
      ]);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialValues.id ? 'Edit' : 'Add'} Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              onChange={formik.handleChange}
              value={formik.values.companyName}
              isInvalid={!!formik.errors.companyName && formik.touched.companyName}
              onBlur={formik.handleBlur}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.companyName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Integrations</Form.Label>
            <div style={{ width: '100%' }}>
              <DropdownButton
                id="dropdown-integrations"
                title={
                  formik.values.integrations.length > 0
                    ? formik.values.integrations.map(i => i.integrationName).join(', ')
                    : "Select Integrations"
                }
                show={dropdownOpen}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onToggle={() => setDropdownOpen(!dropdownOpen)}
                variant="light"
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  border: '1px solid #ced4da',
                  color: '#212529',
                }}
                className="mb-2"
              >
                {AVAILABLE_INTEGRATIONS.map((integration) => (
                  <Dropdown.Item
                    key={integration.integrationName}
                    as="button"
                    onClick={e => {
                      e.preventDefault();
                      handleIntegrationChange(integration);
                    }}
                    active={isSelected(integration)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: '#fff',
                      color: '#212529',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(integration)}
                      readOnly
                      style={{ marginRight: 8 }}
                    />
                    <img
                      src={integration.integrationLogo}
                      alt={integration.integrationName}
                      style={{ width: 24, height: 24, objectFit: 'contain' }}
                    />
                    {integration.integrationName}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            {formik.touched.integrations && typeof formik.errors.integrations === 'string' && (
              <div className="text-danger">{formik.errors.integrations}</div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompanyModal;