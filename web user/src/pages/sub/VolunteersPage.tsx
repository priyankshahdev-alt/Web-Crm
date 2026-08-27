import { SubPageEditor } from '../SubPageEditor'

export function VolunteersPage() {
  return (
    <SubPageEditor
      slug="volunteers"
      title="Volunteers"
      description="Volunteer registration, programs, and engagement"
      sectionKey="volunteers-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Become a Volunteer' },
        { key: 'tag', label: 'Tag', placeholder: 'Volunteer' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'How to volunteer with BeingSevak' },
      ]}
    />
  )
}
