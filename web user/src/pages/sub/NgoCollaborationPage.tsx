import { SubPageEditor } from '../SubPageEditor'

export function NgoCollaborationPage() {
  return (
    <SubPageEditor
      slug="ngo-collaboration"
      title="NGO Collaboration"
      description="Partnerships with other NGOs and non-profit organizations"
      sectionKey="ngo-collaboration-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'NGO Collaboration' },
        { key: 'tag', label: 'Tag', placeholder: 'Partnerships' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'How NGOs can collaborate with BeingSevak' },
      ]}
    />
  )
}
