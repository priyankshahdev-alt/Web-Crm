import { SubPageEditor } from '../SubPageEditor'

export function NewspaperPage() {
  return (
    <SubPageEditor
      slug="newspaper"
      title="In Newspaper"
      description="Newspaper clippings and media coverage"
      sectionKey="newspaper-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'In The Newspaper' },
        { key: 'tag', label: 'Tag', placeholder: 'Press Coverage' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Newspaper coverage and clippings' },
      ]}
    />
  )
}
