import "./GalleryPage.css";

const galleryImages = [
  "/images/gallery/vidhyalay1.jpg",
  "/images/gallery/nari1.jpg",
  "/images/gallery/hunger1.jpg",
  "/images/gallery/jal1.jpg",
  "/images/gallery/sahara1.jpg",
  "/images/gallery/img5.jpg",
  "/images/Ashray/img1.jpg",
  "/images/gallery/pashu1.jpg",
  "/images/gallery/vidhyalay3.jpg",
  "/images/gallery/nari3.jpg",
  "/images/gallery/hunger3.jpg",
  "/images/gallery/jal3.jpg",
  "/images/gallery/sahara3.jpg",
  "/images/gallery/img3.jpg",
  "/images/Ashray/img3.jpg",
  "/images/gallery/pashu3.jpg",
];

function GalleryPage() {
  return (
    <main className="gallery-page">
      <section className="gh-panel">
        <div className="gh-heading">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-1 bg-primary rounded-full" />
            <span className="font-label-md text-primary uppercase tracking-[0.2em]">GALLERY</span>
            <div className="w-10 h-1 bg-primary rounded-full" />
          </div>
          <h1 className="font-headline-lg text-primary mb-4">Our Gallery</h1>
          <p className="font-body-lg text-on-surface-variant">
            Moments from our projects across every sector of development.
          </p>
        </div>
        <h3 className="gh-hint">Moments in motion</h3>
      </section>

      <section className="gh-marquee marquee-container">
        <div className="marquee-track-left">
          <div className="flex gap-8 px-4">
            {galleryImages.map((src) => (
              <div className="gh-card" key={src}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="flex gap-8 px-4">
            {galleryImages.map((src) => (
              <div className="gh-card" key={`dup-${src}`}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gh-panel">
        <h3 className="gh-hint">That's it!</h3>
      </section>
    </main>
  );
}

export default GalleryPage;
