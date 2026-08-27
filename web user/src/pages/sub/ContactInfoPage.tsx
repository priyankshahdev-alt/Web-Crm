import { SubPageEditor } from '../SubPageEditor'

export function ContactInfoPage() {
  return (
    <SubPageEditor
      slug="contact"
      title="Contact Information"
      description="Office address, phone numbers, email, and map"
      sectionKey="contact-hero"
      fields={[
        { key: 'heading', label: 'Page Heading', placeholder: 'Contact Us' },
        { key: 'tag', label: 'Tag', placeholder: 'Get in Touch' },
        { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Full office address' },
        { key: 'phone', label: 'Phone Number', placeholder: '+91 99999 99999' },
        { key: 'email', label: 'Email', placeholder: 'info@beingsevak.org' },
        { key: 'mapEmbedUrl', label: 'Google Maps Embed URL', placeholder: 'https://www.google.com/maps/embed?...' },
      ]}
    />
  )
}
