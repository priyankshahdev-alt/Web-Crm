import { SubPageEditor } from '../SubPageEditor'

export function PressReleasesPage() {
  return (
    <SubPageEditor
      slug="press-releases"
      title="Press Releases"
      description="Official press releases and media statements"
      sectionKey="press-releases-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Press Releases' },
        { key: 'tag', label: 'Tag', placeholder: 'Media' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Official press releases and media statements' },
      ]}
    />
  )
}
