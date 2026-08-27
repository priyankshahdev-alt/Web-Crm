import { SubPageEditor } from '../SubPageEditor'

export function EnquiryPage() {
  return (
    <SubPageEditor
      slug="enquiry"
      title="Enquiry Form"
      description="Configure the public enquiry/contact form settings"
      sectionKey="enquiry-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Send Us a Message' },
        { key: 'tag', label: 'Tag', placeholder: 'Enquiry' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Form description text' },
      ]}
    />
  )
}
