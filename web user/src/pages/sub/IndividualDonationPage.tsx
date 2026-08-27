import { SubPageEditor } from '../SubPageEditor'

export function IndividualDonationPage() {
  return (
    <SubPageEditor
      slug="individual-donation"
      title="Individual Donation"
      description="Individual donation options, UPI links, and recurring donation settings"
      sectionKey="individual-donation-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Donate as an Individual' },
        { key: 'tag', label: 'Tag', placeholder: 'Support Us' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'How individuals can donate' },
        { key: 'upiId', label: 'UPI ID', placeholder: 'beingsevak@upi' },
        { key: 'qrCodeUrl', label: 'QR Code Image URL', placeholder: 'https://...' },
      ]}
    />
  )
}
