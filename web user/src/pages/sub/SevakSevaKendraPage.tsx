import { SubPageEditor } from '../SubPageEditor'

export function SevakSevaKendraPage() {
  return (
    <SubPageEditor
      slug="sevak-seva-kendra"
      title="Sevak Seva Kendra"
      description="Community service centers and local outreach"
      sectionKey="program-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Sevak Seva Kendra' },
        { key: 'tag', label: 'Tag', placeholder: 'Community Service' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About Sevak Seva Kendra centers' },
      ]}
    />
  )
}
