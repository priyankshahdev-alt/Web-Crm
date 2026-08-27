import { SubPageEditor } from '../SubPageEditor'

export function AwardsPage() {
  return (
    <SubPageEditor
      slug="awards"
      title="Awards & Achievements"
      description="Recognition, awards, and milestones achieved by BeingSevak"
      sectionKey="awards-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Awards & Achievements' },
        { key: 'tag', label: 'Tag', placeholder: 'Recognition' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Our achievements and recognitions' },
      ]}
    />
  )
}
