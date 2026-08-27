import { SubPageEditor } from '../SubPageEditor'

export function CsrPage() {
  return (
    <SubPageEditor
      slug="csr"
      title="CSR Partnerships"
      description="Corporate Social Responsibility partnership opportunities"
      sectionKey="csr-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'CSR Partnerships' },
        { key: 'tag', label: 'Tag', placeholder: 'Corporate' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'CSR collaboration details and benefits' },
      ]}
    />
  )
}
