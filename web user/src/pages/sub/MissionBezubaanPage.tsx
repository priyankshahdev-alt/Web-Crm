import { SubPageEditor } from '../SubPageEditor'

export function MissionBezubaanPage() {
  return (
    <SubPageEditor
      slug="mission-bezubaan"
      title="Mission Bezubaan"
      description="Animal welfare and stray animal care programs"
      sectionKey="program-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Mission Bezubaan' },
        { key: 'tag', label: 'Tag', placeholder: 'Animal Welfare' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About Mission Bezubaan programs' },
      ]}
    />
  )
}
