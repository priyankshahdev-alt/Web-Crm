import { SubPageEditor } from '../SubPageEditor'

export function SchoolCollaborationPage() {
  return (
    <SubPageEditor
      slug="school-collaboration"
      title="School Collaboration"
      description="Partnerships with schools for education and awareness programs"
      sectionKey="school-collaboration-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'School Collaboration' },
        { key: 'tag', label: 'Tag', placeholder: 'Education' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'How schools can collaborate with BeingSevak' },
      ]}
    />
  )
}
