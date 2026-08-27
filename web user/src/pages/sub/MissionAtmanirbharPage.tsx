import { SubPageEditor } from '../SubPageEditor'

export function MissionAtmanirbharPage() {
  return (
    <SubPageEditor
      slug="mission-atmanirbhar"
      title="Mission Atmanirbhar"
      description="Skill development and livelihood programs"
      sectionKey="program-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Mission Atmanirbhar' },
        { key: 'tag', label: 'Tag', placeholder: 'Skill Development' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About Mission Atmanirbhar programs' },
      ]}
    />
  )
}
