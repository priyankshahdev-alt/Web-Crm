import { SubPageEditor } from '../SubPageEditor'

export function MissionArogyaPage() {
  return (
    <SubPageEditor
      slug="mission-arogya"
      title="Mission Arogya"
      description="Healthcare and medical aid programs"
      sectionKey="program-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Mission Arogya' },
        { key: 'tag', label: 'Tag', placeholder: 'Healthcare' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About Mission Arogya programs' },
      ]}
    />
  )
}
