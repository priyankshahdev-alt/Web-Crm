import { SubPageEditor } from '../SubPageEditor'

export function EcoWarriorsPage() {
  return (
    <SubPageEditor
      slug="eco-warriors"
      title="Mission Eco-Warriors"
      description="Environmental conservation and sustainability programs"
      sectionKey="program-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Mission Eco-Warriors' },
        { key: 'tag', label: 'Tag', placeholder: 'Environment' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About Mission Eco-Warriors programs' },
      ]}
    />
  )
}
