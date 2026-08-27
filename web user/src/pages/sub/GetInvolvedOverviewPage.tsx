import { SubPageEditor } from '../SubPageEditor'

export function GetInvolvedOverviewPage() {
  return (
    <SubPageEditor
      slug="get-involved"
      title="Get Involved"
      description="Overview page for donation, volunteering, and collaboration opportunities"
      sectionKey="get-involved-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Get Involved' },
        { key: 'tag', label: 'Tag', placeholder: 'Join Us' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'How people can contribute to BeingSevak' },
      ]}
    />
  )
}
