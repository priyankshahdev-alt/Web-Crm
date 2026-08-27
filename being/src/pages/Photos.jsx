import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { usePageContent } from '../hooks/usePageContent';

const galleryItems = [
  { category: 'campaigns', img: '/images/annapurna 2.png', title: 'Mission Annapurna', desc: 'Food distribution drive reaching thousands of families', wide: true },
  { category: 'education', img: '/images/KIT.png', title: 'Mission Vidhya', desc: 'Education kits distributed to underprivileged children' },
  { category: 'community', img: '/images/Aurat 2.png', title: 'Mission Aurat', desc: 'Sanitary pad & hygiene kit distribution drives' },
  { category: 'community', img: '/images/Aatmnirbhar 1.png', title: 'Mission Atma Nirbhar', desc: 'Employment & self-reliance support programs' },
  { category: 'health', img: '/images/Dialysis Centre.png', title: 'Dialysis Centre', desc: 'Affordable medical & dialysis support for all' },
  { category: 'campaigns', img: '/images/BEACH.png', title: 'Mission Beach Sevak', desc: 'Beach cleaning & environmental awareness drives' },
  { category: 'community', img: '/images/Animal.png', title: 'Mission Bezubaan', desc: 'Animal care & feeding initiative for strays' },
  { category: 'health', img: '/images/eye.jpg', title: 'Sevak Eye Health Programme', desc: 'Free eye screenings & cataract surgeries' },
  { category: 'education', img: '/images/vidhya 1.png', title: 'Digital Education', desc: 'Digital education centers bridging the gap' },
  { category: 'campaigns', img: '/images/tree plantion 2.png', title: 'Sevak Eco Initiative', desc: 'Plantation drives & eco-awareness campaigns', wide: true },
  { category: 'events', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop', title: 'Community Outreach', desc: 'Engaging with local communities across regions' },
  { category: 'events', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop', title: 'Awareness Drive', desc: 'Spreading awareness in rural communities' },
  { category: 'campaigns', img: '/images/KIT 1.png', title: 'Stationery Distribution', desc: 'School supplies for underprivileged students' },
  { category: 'health', img: '/images/h2.png', title: 'Project H2O', desc: 'School renovation & hygiene facility projects' },
  { category: 'community', img: '/images/babycare.png', title: 'Baby Care Center', desc: 'Infant nutrition & care programs' },
];

const moreItems = [
  { category: 'community', img: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&auto=format&fit=crop', title: 'Community Kitchen', desc: 'Mid-day meal program in action', wide: true },
  { category: 'health', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop', title: 'Medical Camp', desc: 'Free health checkup camps for villagers' },
  { category: 'education', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop', title: 'School Supplies', desc: 'Distributing books and stationery' },
  { category: 'events', img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop', title: 'Award Ceremony', desc: 'Celebrating community achievements' },
  { category: 'campaigns', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop', title: 'Clean-Up Drive', desc: 'Volunteers making a difference' },
  { category: 'community', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop', title: 'Festival Celebration', desc: 'Spreading joy during festivals' },
];

const filters = ['all', 'campaigns', 'education', 'health', 'community', 'events'];

const Photos = () => {
  const content = usePageContent('photos');

  const heroTitlePrefix = content('photos-hero', 'titlePrefix') ?? 'Our';
  const heroTitleHighlight = content('photos-hero', 'titleHighlight') ?? 'Gallery';

  const headingTitlePrefix = content('photos-heading', 'titlePrefix') ?? 'Moments of';
  const headingTitleHighlight = content('photos-heading', 'titleHighlight') ?? 'Impact';
  const headingSubtitle =
    content('photos-heading', 'subtitle') ??
    'Capturing the spirit of service through our journey of compassion and change';

  const initialItems = content('photos-gallery', 'items') ?? galleryItems;
  const extraItems = content('photos-more', 'items') ?? moreItems;

  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState(initialItems);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const visibleItems = activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter);

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = useCallback((dir) => {
    setLightboxIndex(prev => (prev + dir + visibleItems.length) % visibleItems.length);
  }, [visibleItems.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, navigateLightbox]);

  const handleLoadMore = () => {
    setItems(prev => [...prev, ...extraItems]);
    setLoadMoreVisible(false);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--navy:#03163E;--mid:#315371;--cyan:#00A2D9;--cyan-light:#33bce8;--green:#2eb85c;--white:#ffffff;--light-bg:#f4f7fb;--text-dark:#1a1a2e;--text-mid:#4a5568;--gold:#D4AF37;}
        body{font-family:'Open Sans',sans-serif;color:var(--text-dark);background:var(--light-bg);}
        .page-hero{background:linear-gradient(rgba(3,22,62,0.75), rgba(3,22,62,0.75)), url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80') center/cover no-repeat;padding:85px 24px;text-align:center;color:white;}
        .page-hero h1{font-family:'Montserrat',sans-serif;font-weight:900;font-size:2.8rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}
        .page-hero h1 span{color:var(--cyan-light);}
        .breadcrumb{font-size:0.88rem;color:rgba(255,255,255,0.82);display:flex;align-items:center;justify-content:center;gap:8px;}
        .breadcrumb a{color:rgba(255,255,255,0.82);}
        .breadcrumb a:hover{color:var(--cyan);}
        .gallery-wrap{max-width:1280px;margin:0 auto;padding:60px 28px 80px;}
        .section-title{font-family:'Montserrat',sans-serif;font-weight:900;font-size:2.2rem;color:var(--navy);text-align:center;margin-bottom:8px;}
        .section-title span{color:var(--cyan);}
        .section-subtitle{text-align:center;font-size:0.95rem;color:var(--text-mid);margin-bottom:12px;line-height:1.7;}
        .section-subtitle::after{content:'';display:block;width:60px;height:4px;background:var(--cyan);margin:18px auto 0;border-radius:2px;}
        .filter-bar{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:36px 0 40px;}
        .filter-btn{font-family:'Montserrat',sans-serif;font-size:0.78rem;font-weight:700;padding:9px 22px;border-radius:30px;background:white;color:var(--text-mid);border:2px solid #e0e0e0;transition:all 0.3s ease;letter-spacing:0.3px;}
        .filter-btn:hover{border-color:var(--cyan);color:var(--cyan);}
        .filter-btn.active{background:var(--cyan);color:white;border-color:var(--cyan);box-shadow:0 4px 15px rgba(0,162,217,0.3);}
        .gallery-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:20px;}
        .gallery-item{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;aspect-ratio:4/3;background:#dce4ec;opacity:1;transform:translateY(0);transition:opacity 0.6s ease, transform 0.6s ease;}
        .gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;}
        .gallery-item:hover img{transform:scale(1.08);}
        .gallery-item .overlay{position:absolute;inset:0;background:linear-gradient(to top, rgba(3,22,62,0.85) 0%, transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;padding:20px;opacity:0;transition:opacity 0.35s ease;}
        .gallery-item:hover .overlay{opacity:1;}
        .gallery-item .overlay h3{font-family:'Montserrat',sans-serif;font-size:0.95rem;font-weight:700;color:white;margin-bottom:3px;}
        .gallery-item .overlay p{font-size:0.72rem;color:rgba(255,255,255,0.75);}
        .gallery-item .expand-icon{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;opacity:0;transform:scale(0.8);transition:all 0.3s ease;}
        .gallery-item:hover .expand-icon{opacity:1;transform:scale(1);}
        .gallery-item.wide{grid-column:span 2;}
        .gallery-item.hide{display:none;}
        .lightbox{position:fixed;inset:0;z-index:3000;background:rgba(3,22,62,0.95);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:all 0.35s ease;}
        .lightbox.open{opacity:1;visibility:visible;}
        .lightbox-close{position:absolute;top:24px;right:24px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.1);color:white;font-size:20px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;z-index:10;cursor:pointer;border:none;}
        .lightbox-close:hover{background:rgba(255,255,255,0.25);}
        .lightbox-img{max-width:85vw;max-height:82vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);transform:scale(0.9);transition:transform 0.4s ease;}
        .lightbox.open .lightbox-img{transform:scale(1);}
        .lightbox-caption{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.85);font-size:15px;text-align:center;max-width:600px;}
        .lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.1);color:white;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;cursor:pointer;border:none;}
        .lightbox-nav:hover{background:rgba(255,255,255,0.25);}
        .lightbox-nav.prev{left:24px;}
        .lightbox-nav.next{right:24px;}
        .load-more-wrap{text-align:center;margin-top:40px;}
        .load-more-btn{font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:700;padding:14px 40px;border-radius:30px;background:var(--cyan);color:white;letter-spacing:0.5px;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(0,162,217,0.3);}
        .load-more-btn:hover{background:var(--mid);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,162,217,0.4);}
        .load-more-btn i{margin-left:8px;}
        @media(max-width:860px){.page-hero{padding:60px 24px;}.page-hero h1{font-size:2rem;}.gallery-grid{grid-template-columns:repeat(2, 1fr);}.gallery-item.wide{grid-column:span 1;}}
        @media(max-width:600px){.page-hero h1{font-size:1.6rem;}.gallery-grid{grid-template-columns:1fr;}.filter-bar{gap:6px;}.filter-btn{font-size:0.72rem;padding:7px 14px;}}
      `}</style>

      <section className="page-hero">
        <h1>{heroTitlePrefix} <span>{heroTitleHighlight}</span></h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>&raquo;</span>
          <span>Gallery & Media Room</span>
          <span>&raquo;</span>
          <span>Photos</span>
        </div>
      </section>

      <section className="gallery-wrap">
        <h2 className="section-title">{headingTitlePrefix} <span>{headingTitleHighlight}</span></h2>
        <p className="section-subtitle">{headingSubtitle}</p>

        <div className="filter-bar">
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, idx) => (
            <div key={idx} className={`gallery-item${item.wide ? ' wide' : ''}`} onClick={() => openLightbox(idx)}>
              <img src={item.img} alt={item.title} loading="lazy" decoding="async" width="800" height="600" />
              <div className="overlay">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="expand-icon"><i className="fas fa-expand"></i></div>
            </div>
          ))}
        </div>

        {loadMoreVisible && (
          <div className="load-more-wrap">
            <button className="load-more-btn" onClick={handleLoadMore}>Load More <i className="fas fa-arrow-down"></i></button>
          </div>
        )}
      </section>

      <div className={`lightbox${lightboxOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}>
        <button className="lightbox-close" onClick={closeLightbox}><i className="fas fa-times"></i></button>
        <button className="lightbox-nav prev" onClick={() => navigateLightbox(-1)}><i className="fas fa-chevron-left"></i></button>
        <button className="lightbox-nav next" onClick={() => navigateLightbox(1)}><i className="fas fa-chevron-right"></i></button>
        <img className="lightbox-img" src={visibleItems[lightboxIndex]?.img} alt="" loading="lazy" decoding="async" width="800" height="600" />
        <div className="lightbox-caption">
          {visibleItems[lightboxIndex]?.title} {visibleItems[lightboxIndex]?.desc ? `â€” ${visibleItems[lightboxIndex]?.desc}` : ''}
        </div>
      </div>
    </>
  );
};

export default Photos;

