import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { usePageContent } from '../hooks/usePageContent';

export default function Home() {
  const { getSetting, getSection, getSlides, getStats } = useSite();
  const content = usePageContent('home');

  // Live WebCrm content (falls back to the static sections when unavailable)
  const cmsSlides = getSlides();
  const liveHero = cmsSlides.length > 0;
  const siteName = getSetting('site.siteName', 'Being Sevak Charitable Trust');
  const waNumber = (getSetting('whatsapp.number', '') || getSetting('contact.phone', '')).replace(/\D+/g, '') || '918879035035';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${siteName}, I would like to know more.`)}`;
  const storySection = getSection('about', 'story');
  const storyParagraphs = (storySection?.content?.paragraphs || []).filter(
    (p) => p && p.trim(),
  );
  const aboutDesc =
    storyParagraphs.join(' ') || getSetting('site.description', '');
  const cmsStats = getStats();
  const staticStats = [
    { value: '20000', label: 'Women Supported' },
    { value: '12', label: 'States Connected' },
    { value: '4500', label: 'Support Programs' },
    { value: '300000', label: 'Supported Children' },
    { value: '1000000', label: 'Beneficiaries Reached' },
  ];
  const statsItems = cmsStats || staticStats;

  // WebCrm page content (falls back to the existing hardcoded values when unavailable)
  const aboutHeading = content('home-about', 'heading') ?? 'ABOUT BEING SEVAK CHARITABLE TRUST';
  const aboutVisionTitle = content('home-about', 'visionTitle') ?? 'Our Vision';
  const aboutVisionText =
    content('home-about', 'visionText') ??
    'To create a world where visually impaired, underprivileged children and education';
  const aboutMissionTitle = content('home-about', 'missionTitle') ?? 'Our Mission';
  const aboutMissionText =
    content('home-about', 'missionText') ??
    'To empower and uplift the lives of visually impaired individuals livelihood';
  const aboutReadMoreLabel = content('home-about', 'readMoreLabel') ?? 'Read More';
  const aboutImage = content('home-about', 'image') ?? 'images/about1.png';
  const aboutImageAlt = content('home-about', 'imageAlt') ?? 'Being Sevak';

  const marqueeItems =
    content('home-marquee', 'items') ?? [
      { value: '180000+', label: 'Mid-Day Meal', image: 'images/09.png' },
      { value: '2500+', label: 'Medical Relief', image: 'images/03.png' },
      { value: '40000+', label: 'Eye Care', image: 'images/02.png' },
      { value: '375000+', label: 'Sevak Meal', image: 'images/09.png' },
      { value: '2500+', label: 'Medical Relief', image: 'images/03.png' },
      { value: '650000+', label: 'Annapurna Kit', image: 'images/04.png' },
      { value: '195000+', label: 'Vidhya Kit', image: 'images/05.png' },
      { value: '125000+', label: 'Mission Aurat', image: 'images/06.png' },
      { value: '3500+', label: 'Mission Bezubaan', image: 'images/07.png' },
      { value: '1200+', label: 'Digital Education Centre', image: 'images/08.png' },
    ];

  const impactStoriesHeading = content('home-impact-stories', 'heading') ?? 'Impact Stories';
  const impactStoriesDescription =
    content('home-impact-stories', 'description') ?? 'Real Change Through Our Work';
  const impactStories =
    content('home-impact-stories', 'items') ?? [
      { title: 'Rozgaar Booth', image: 'images/i8.jpg', alt: 'Rozgaar Booth', link: '/impact/rozgaar-booth' },
      { title: 'Baby Feeding Centre', image: 'images/i6.jpg', alt: 'Baby Feeding Centre', link: '/impact/baby-feeding' },
      { title: 'Tricycle To Lifecycle', image: 'images/i7.jpg', alt: 'Tricycle To Lifecycle', link: '/impact/tricycle' },
      { title: 'Sewing Machine', image: 'images/i9.png', alt: 'Sewing Machine', link: '/impact/sewing-machine' },
      { title: 'Flour Mill distribution', image: 'images/floormill.png', alt: 'Flour Mill distribution', link: '/impact/flour-mill' },
      { title: 'Medical Support', image: 'images/i5.jpg', alt: 'Medical Support', link: '/impact/emergency-medical' },
      { title: 'Health To Hygiene(H2)', image: 'images/i4.jpg', alt: 'Health To Hygiene(H2)', link: '/impact/health-to-hygiene' },
      { title: 'Sanitary Pad Vending Machine', image: 'images/i1.jpg', alt: 'Sanitary Pad Vending Machine', link: '/impact/sanitary-pad' },
      { title: 'Dialysis Center', image: 'images/dialysis.png', alt: 'Dialysis Center', link: '/impact/dialysis-center' },
      { title: 'Bottle crusher Machine', image: 'images/i2.jpg', alt: 'Bottle crusher Machine', link: '/impact/bottle-crusher' },
    ];

  const mostNeededHeading = content('home-most-needed', 'heading') ?? 'Most Needed';
  const mostNeededDescription =
    content('home-most-needed', 'description') ??
    'Every moment matters—people are struggling without basic needs';
  const mostNeededCauses =
    content('home-most-needed', 'items') ?? [
      { title: 'Mission Bezubaan', description: 'Animal feeding support, paw care services, and Pedigree distribution.', imageClass: 'cause-img-5', progress: '78%', funded: '78% Funded', raised: '₹2,34,000 raised', link: '/mission-bezubaan' },
      { title: 'Project H2', description: 'Clean water and washroom facilities for schools.', imageClass: 'cause-img-6', progress: '55%', funded: '55% Funded', raised: '₹1,12,000 raised', link: '/mission-wellness' },
      { title: 'Baby Feeding Booth', description: 'Safe and hygienic baby feeding booths for mothers and child care in government hospitals.', imageClass: 'cause-img-7', progress: '91%', funded: '91% Funded', raised: '₹3,08,000 raised', link: '/mission-aurat' },
      { title: 'Sevak Niwas', description: 'provides housing, care and dignity to visually impaired individuals and families in need.', imageClass: 'cause-img-8', progress: '63%', funded: '63% Funded', raised: '₹1,74,000 raised', link: '/sevak-nivash' },
    ];

  const urgentHeading =
    content('home-urgent-appeals', 'heading') ?? 'Urgent Appeals';
  const urgentDescription =
    content('home-urgent-appeals', 'description') ??
    'Every moment matters—people are struggling without basic needs';
  const urgentAppeals =
    content('home-urgent-appeals', 'items') ?? [
      { title: 'Mission Annapurna', description: 'Dry Ration Kit , Mid-Day Meal , Snacks kit. Meals With Care.', imageClass: 'cause-img-1', progress: '78%', funded: '78% Funded', raised: '₹2,34,000 raised', link: '/mission-annapurna' },
      { title: 'Mission Vidhya', description: 'Digital Education Center, Writing Pad Distribution, and Stationery Kit Distribution.', imageClass: 'cause-img-2', progress: '55%', funded: '55% Funded', raised: '₹1,12,000 raised', link: '/mission-vidhya' },
      { title: 'Medical Emergency', description: 'Financial aid for critical treatments, surgeries, and emergency care.', imageClass: 'cause-img-3', progress: '91%', funded: '91% Funded', raised: '₹3,08,000 raised', link: '/mission-wellness' },
      { title: 'Mission Atmanirbhar', description: 'Empowering lives through livelihood support and essential assistive tools.', imageClass: 'cause-img-4', progress: '63%', funded: '63% Funded', raised: '₹1,74,000 raised', link: '/mission-atmanirbhar' },
    ];

  const eduTitle = content('home-support-education', 'title') ?? 'Support Education';
  const eduSubtitle =
    content('home-support-education', 'subtitle') ?? "Help Us Transform A Child's Life";
  const eduDescription =
    content('home-support-education', 'description') ??
    'Your support can give education, hope and a brighter future to a needy child.';
  const eduPrice =
    content('home-support-education', 'price') ??
    'For only Rs.1250/- per month, you can keep a child in school.';
  const eduButtonLabel = content('home-support-education', 'buttonLabel') ?? 'Give Now';
  const eduButtonUrl = content('home-support-education', 'buttonUrl') ?? '#';
  const eduImage = content('home-support-education', 'image') ?? 'images/supportedu.png';

  const eyeTag = content('home-eye-health', 'tag') ?? 'Sevak Eye Health Programme';
  const eyeHeading =
    content('home-eye-health', 'heading') ?? 'Protecting Vision With Compassion';
  const eyeDescription =
    content('home-eye-health', 'description') ??
    'Being Sevak Charitable Trust believes prevention is better than cure. Through eye screenings, spectacles and cataract surgeries, we help thousands restore better eyesight.';
  const eyeImage = content('home-eye-health', 'image') ?? 'images/eye.jpeg';
  const eyeStats =
    content('home-eye-health', 'items') ?? [
      { value: '9225+', label: 'Eye Screenings' },
      { value: '5156+', label: 'People Refracted' },
      { value: '4389+', label: 'Spectacles Dispensed' },
      { value: '767+', label: 'Cataract Surgeries' },
    ];
  const eyeButtonLabel = content('home-eye-health', 'buttonLabel') ?? 'Donate Now';
  const eyeButtonUrl = content('home-eye-health', 'buttonUrl') ?? '/donate';

  const celebrityHeading = content('home-celebrity', 'heading') ?? 'Celebrity Notes';
  const celebrityDescription =
    content('home-celebrity', 'description') ??
    'Recognitions and appreciation from notable personalities';
  const celebrityImages =
    content('home-celebrity', 'images') ?? [
      'images/celebritynote/1.jpg',
      'images/celebritynote/2.jpg',
      'images/celebritynote/3.jpg',
      'images/celebritynote/4.jpg',
    ];
  const celebritySlides = Array.from(
    { length: Math.ceil(celebrityImages.length / 2) },
    (_, i) => celebrityImages.slice(i * 2, i * 2 + 2),
  );

  const metroHeading =
    content('home-metro', 'heading') ??
    'Transforming Metro Stations with Care & Community';
  const metroParagraphs =
    content('home-metro', 'paragraphs') ?? [
      'In partnership with metro authorities, Being Sevak Charitable Trust is dedicated Is to transformed metro stations into cleaner, safer, and more compassionate public spaces for every commuter. With a vision rooted in social responsibility and community well-being, we strive to make everyday travel more dignified, sustainable, and accessible for all.',
      'Through impactful urban welfare initiatives, we have installed Bottle Crusher Machines at metro stations to encourage responsible plastic disposal and promote environmental awareness among thousands of daily passengers. By turning waste management into a community movement, we aim to inspire cleaner habits and contribute towards a greener future.',
      'Understanding the importance of women\'s health, dignity, and hygiene, we have also introduced Digital Sanitary Pad Vending Machines to provide easy and reliable access to essential hygiene products within metro premises. This initiative supports women commuters with convenience, care, and confidence during their daily journeys.',
      'Every initiative we undertake is a step towards creating people-centric infrastructure that not only serves commuters but also nurtures social awareness, environmental responsibility, and inclusive urban development. Through compassion-driven action, we continue working towards a future where public spaces reflect care, humanity, and sustainability for every citizen.',
    ];
  const metroItems =
    content('home-metro', 'items') ?? [
      { image: 'images/bottle.JPG', label: 'Bottle Crusher Machine', price: '₹1,80,000', buttonLabel: 'DONATE NOW', link: '/donate' },
      { image: 'images/sanitary.JPG', label: 'Sanitary Pad Vending Machine', price: '₹7,000', buttonLabel: 'DONATE NOW', link: '/donate' },
    ];
  const metroImage = content('home-metro', 'image') ?? 'images/bottelmetro.jpeg';

  const promiseHeading = content('home-promise', 'heading') ?? 'OUR PROMISE TO YOU :';
  const promiseParagraphs =
    content('home-promise', 'paragraphs') ?? [
      'Every donation you make helps us serve people with dignity, compassion, and transparency. Our mission is to bring hope, support, and positive change to communities in need through food distribution, healthcare, education, and humanitarian aid.',
      'We believe in creating impact with honesty and care. Together, we can build a better future and spread kindness to every life we touch.',
    ];
  const promiseImage = content('home-promise', 'image') ?? 'logo11.png';

  const activitiesHeading = content('home-activities', 'heading') ?? 'Our Activities';
  const activitiesDescription =
    content('home-activities', 'description') ??
    'Your donation reaches those who need it most';
  const activitiesItems =
    content('home-activities', 'items') ?? [
      { image: 'images/Hospitalization&HealthCareIMG.jpg', title: 'Hospitalization & Health Care', description: 'Due to the low financial condition, no proper health care' },
      { image: 'images/NewClothingDistribution.jpg', title: 'New Clothing Distribution', description: 'For someone who cannot even afford daily meals, even a' },
      { image: 'images/CelebrationofNationalPrograms.jpg', title: 'Celebration of National Program', description: 'To keep the fire of patriotism burning in the hearts' },
      { image: 'images/ReliefforDialysisPatients.jpg', title: 'Relief for Dialysis Patients', description: 'To add happiness to the lives of dialysis patients, we' },
      { image: 'images/SwachhBharatAwarenessCampaign.jpg', title: 'Awareness for Swatch Bharat', description: 'In this program we try to motivate people by organizing' },
      { image: 'images/BLIND.jpg', title: 'Blind Widow Care', description: 'Our organization takes special care for the widow as they' },
      { image: 'images/AwarenessCampaign.jpg', title: 'Public Awareness', description: 'Road Safety Awareness Campaign - Our main motto of this' },
      { image: 'images/EducationFacilitiesforBlind&UnderprivilegedChildren.jpg', title: 'Education Facilities for Blind & Underprivileged Children', description: 'Education at grass-root level is the need of the hour!' },
      { image: 'images/SevakGameswithMembers.jpg', title: 'Sevak Games with Members', description: 'Our organization celebrates "SEVAK GAMES" every year for specially abled' },
      { image: 'images/sevakMemCard.jpg', title: 'Sevak Membership Card', description: 'At present our organization has many registered members. To provide' },
      { image: 'images/Matrimonial.jpeg', title: 'Matrimonial Program', description: 'As we all know couples are made in heaven and' },
      { image: 'images/houserepair.jpg', title: 'House Repairing Activity', description: 'Sevak team arranged house repairing activities for our Blind and' },
      { image: 'images/EyeCamp.jpg', title: 'Eye Camp', description: 'The reality is that most of the blind people in' },
      { image: 'images/Pandemic-1.jpg', title: 'Pandemic relief support for Covid-19', description: 'Starting April 2020, Being Sevak Charitable Trust has organized programs' },
      { image: 'images/DryRationKitDistribution.jpg', title: 'Dry Ration Kit', description: 'Providing essential food supplies to needy families.' },
      { image: 'images/Mid-DayMealProgram.jpg', title: 'Mid-Day Meal', description: 'Nutritious meals for underprivileged and visually impaired individuals.' },
      { image: 'images/SNACKSKit.jpg', title: 'Snacks Kit', description: 'Distributing healthy snack kits to underserved communities.' },
      { image: 'images/D.E.C2.jpg', title: 'Digital Education Centre', description: 'Empowering children through free digital learning access.' },
      { image: 'images/stationarykit.jpg', title: 'Stationery Kit Distribution', description: 'Providing school stationery kits to needy students.' },
      { image: 'images/Rozgharnew.jpeg', title: 'Rozgaar Booth', description: 'Creating employment opportunities for financially struggling families.' },
      { image: 'images/activity1.jpg', title: 'Wheelchair & Tricycle Distribution', description: 'Restoring mobility and independence for specially-abled individuals.' },
      { image: 'images/SewingMachineDistribution.jpg', title: 'Sewing Machine Distribution', description: 'Empowering women through self-employment and skill support.' },
      { image: 'images/FlourMillDistribution.jpg', title: 'Floor Mill Distribution', description: 'Supporting sustainable income generation for needy families.' },
      { image: 'images/SchoolRenovationProject.jpg', title: 'School Renovation', description: 'Improving school infrastructure for better student learning.' },
      { image: 'images/FinancialAssistanceProgram.jpg', title: 'Financial assistance Program', description: 'Supporting sustainable income generation for needy families.' },
      { image: 'images/HandwashingStationInstallation.jpg', title: 'Handwashing Station', description: 'Promoting hygiene and cleanliness among school children.' },
      { image: 'images/TreePlantationDrive.jpg', title: 'Tree Plantation', description: 'Creating a greener and healthier environment for future generations.' },
      { image: 'images/bloodDonation.jpg', title: 'Blood Donation camp', description: 'Saving lives through voluntary blood donation and promoting community health awareness.' },
      { image: 'images/BottleCrusherMachineInitiative.jpg', title: 'Bottle Crusher Machine', description: 'Encouraging plastic recycling and environmental sustainability.' },
      { image: 'images/AnimalFeedingCenter.jpg', title: 'Animal Feeding Center', description: 'Providing food and care for stray and abandoned animals.' },
      { image: 'images/sanitarypadkit.jpg', title: 'Sanitary Pad Distribution', description: 'Promoting menstrual hygiene awareness among women and girls.' },
      { image: 'images/HygieneKitDistribution.jpg', title: 'Hygiene Kit Distribution', description: 'Providing essential hygiene kits to underprivileged communities.' },
      { image: 'images/BabyCare.jpg', title: 'Baby Care Center', description: 'Supporting mothers and newborns with safe care facilities.' },
      { image: 'images/Dialysis Centre.png', title: 'Dialysis Centre', description: 'Providing affordable dialysis treatment for needy patients.' },
      { image: 'images/BEACHcleaning.png', title: 'Beach Cleaning Drives', description: 'Organizing cleanliness drives to protect marine environments.' },
    ];

  const featuredProjectsHeading =
    content('home-featured-projects', 'heading') ?? 'Featured Projects';
  const featuredProjects =
    content('home-featured-projects', 'items') ?? [
      {
        cards: [
          { image: 'images/Matrimonial.jpeg', tag: 'EMPOWERMENT', title: 'Blind Vivah', description: 'Empowering visually impaired individuals through skill development and independent living.', link: '/donate', button: 'Give Now' },
          { image: 'images/rasaoighar.jpeg', tag: 'FOOD', title: 'Rasoi Ghar', description: 'Providing nutritious meals to underprivileged communities with dignity and care.', link: '/donate', button: 'Give Now' },
        ],
      },
      {
        cards: [
          { image: 'images/D.E.C.jpg', tag: 'EDUCATION', title: 'Digital Education Centre', description: 'Bridging the digital divide with free computer literacy and online learning access.', link: '/donate', button: 'Give Now' },
          { image: 'images/physiotherepy.jpeg', tag: 'HEALTH', title: 'Physiotherapy Centre', description: 'Providing free physiotherapy and rehabilitation services for those in need.', link: '/donate', button: 'Give Now' },
        ],
      },
      {
        cards: [
          { image: 'images/library.jpeg', tag: 'EDUCATION', title: 'Library Centre', description: 'Establishing community libraries to promote reading and self-learning among underprivileged students.', link: '/donate', button: 'Give Now' },
          { image: 'images/womenempoerment.jpeg', tag: 'EMPOWERMENT', title: 'Women Empowerment & Self Employment Unit', description: 'Providing skill training and livelihood opportunities for women to achieve financial independence.', link: '/donate', button: 'Give Now' },
        ],
      },
    ];
  const featuredProjectsDescription =
    content('home-featured-projects', 'description') ??
    'Make a direct impact with these urgent campaigns';

  const partnersHeading =
    content('home-partners', 'heading') ?? 'OUR PARTNERS';
  const partnersDescription =
    content('home-partners', 'description') ??
    'Together with our partners, we work to bring hope, care, and support to those in need';
  const partnersImages =
    content('home-partners', 'images') ?? [
      '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png','21.png','22.png','23.png','24.png','25.png',
    ];

  const statsHeading = content('stats', 'heading') ?? '11 Years of Impact';
  const statsDescription =
    content('stats', 'description') ??
    'Since 2015, Being Sevak has been serving communities across India';

  const testimonialsHeading =
    content('home-testimonials', 'heading') ?? 'What Our Donors Says';
  const testimonialsDescription =
    content('home-testimonials', 'description') ??
    'Voices of kindness that inspire our mission';
  const testimonials =
    content('home-testimonials', 'items') ?? [
      { quote: 'Supporting this NGO has been one of the most meaningful decisions of my life. Seeing smiles on children\'s faces and families getting support gives real happiness.', name: 'Riya Sharma', role: 'Supportive Donor' },
      { quote: 'This organization is truly changing lives with honesty and dedication. Every donation reaches people who genuinely need help and care.', name: 'Rahul Mehta', role: 'Monthly Contributor' },
      { quote: 'I feel proud to be connected with such a beautiful cause. The impact they create in education, food distribution, and healthcare is inspiring.', name: 'Neha Patel', role: 'Kind Heart Donor' },
      { quote: 'Being part of this mission has been a blessing. The transparency and dedication of Being Sevak is remarkable.', name: 'Amit Verma', role: 'Proud Donor' },
      { quote: 'I have seen the ground work they do. Every rupee is used wisely for those who truly need it.', name: 'Priya Singh', role: 'Regular Contributor' },
    ];

  const latestUpdatesHeading =
    content('home-latest-updates', 'heading') ?? 'Latest Updates';
  const latestUpdatesDescription =
    content('home-latest-updates', 'description') ??
    'Stay informed with our recent activities and announcements';

  // Helper to render "Word <span class=accent>Word</span>" headings from a single string
  const accentSplit = (text) => {
    const i = text.lastIndexOf(' ');
    return i === -1 ? { head: text, tail: '' } : { head: text.slice(0, i), tail: text.slice(i + 1) };
  };
  const impactStoriesH = accentSplit(impactStoriesHeading);
  const mostNeededH = accentSplit(mostNeededHeading);
  const celebrityH = accentSplit(celebrityHeading);
  const activitiesH = accentSplit(activitiesHeading);
  const featuredProjectsH = accentSplit(featuredProjectsHeading);
  const urgentH = accentSplit(urgentHeading);
  const partnersH = accentSplit(partnersHeading);
  const statsH = accentSplit(statsHeading);
  const updatesH = accentSplit(latestUpdatesHeading);

  // Mobile menu


  // Quick Donate
  const [quickAmt, setQuickAmt] = useState(200);

  const [activePreset, setActivePreset] = useState(200);

  // Donation Basket
  const [basketOpen, setBasketOpen] = useState(false);
  const [cartQty, setCartQty] = useState({ annapurna: 0, vidhya: 0, aurat: 0, atma: 0, bezubaan: 0 });
  const [basketName, setBasketName] = useState('');
  const [basketPhone, setBasketPhone] = useState('');
  const [basketEmail, setBasketEmail] = useState('');
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);
  const [basketPhoneErr, setBasketPhoneErr] = useState('');
  const [basketNameErr, setBasketNameErr] = useState('');
  const [basketEmailErr, setBasketEmailErr] = useState('');

  // Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = liveHero ? cmsSlides.length : 8;

  // Impact Stories
  const [currentImpact, setCurrentImpact] = useState(0);
  const totalImpactSlides = 10;

  // Latest Updates Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);

  // Featured Projects
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const totalFeaturedSlides = 3;
  const featuredSliderRef = useRef(null);

  useEffect(() => {
    const box = featuredSliderRef.current;
    if (!box) return;
    const isMobile = () => window.innerWidth <= 768;
    let ticking = false;
    const onScroll = () => {
      if (!isMobile() || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollLeft = box.scrollLeft;
        const slideWidth = box.offsetWidth;
        if (slideWidth > 0) {
          const idx = Math.round(scrollLeft / slideWidth);
          setCurrentFeatured(Math.max(0, Math.min(idx, totalFeaturedSlides - 1)));
        }
        ticking = false;
      });
    };
    box.addEventListener('scroll', onScroll, { passive: true });
    return () => box.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToFeaturedSlide = (idx) => {
    const box = featuredSliderRef.current;
    if (!box || window.innerWidth > 768) return;
    const slideWidth = box.offsetWidth;
    box.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
  };

  // Impact Stats
  const impactRef = useRef(null);
  const [impactAnimated, setImpactAnimated] = useState(false);

  // Month data for modal
  const monthData =
    content('home-latest-updates', 'items') ?? [
      { id: 'month-jan', label: 'Jan 2026', img: 'latesUpdates/JAN 2026.jpg' },
      { id: 'month-feb', label: 'Feb 2026', img: 'latesUpdates/FEB 2026.jpg' },
      { id: 'month-mar', label: 'Mar 2026', img: 'latesUpdates/MARCH 2026.jpg' },
      { id: 'month-apr', label: 'Apr 2026', img: 'latesUpdates/APRIL 2026.jpg' },
      { id: 'month-may', label: 'May 2026', img: '' }
    ];

  // Hero Slider Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Impact Stats Animation with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impactAnimated) {
            setImpactAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (impactRef.current) observer.observe(impactRef.current);
    return () => observer.disconnect();
  }, [impactAnimated]);

  const handlePresetClick = (val) => {
    setQuickAmt(val);
    setActivePreset(val);
  };

  const handleQuickDonate = () => {
    setBasketOpen(true);
  };

  // Donation Basket logic
  const UNIT_PRICE = { annapurna: 500, vidhya: 400, aurat: 300, atma: 600, bezubaan: 200 };
  const basketMissions =
    content('home-basket-missions', 'items') ?? [
    { key: 'annapurna', icon: '\u{1F33E}', name: 'Mission Annapurna', desc: 'Dry Ration Kits & Mid-Day Meals for Visually Impaired & Underprivileged Individuals' },
    { key: 'vidhya', icon: '\u{1F4DA}', name: 'Mission Vidhya', desc: 'D.E.C \u2013 Digital Education Centre, Free digital education, Writing Pad & Stationery Kit Distribution' },
    { key: 'aurat', icon: '\u{1F469}', name: 'Mission Aurat', desc: 'Sanitary Pad Distribution & Hygiene Kit Distribution for underprivileged women' },
    { key: 'atma', icon: '\u{1F4AA}', name: 'Mission Atma Nirbhar', desc: 'Rozgaar Booth, Wheelchair & Tricycle Distribution, Sewing Machine & Flour Mill Distribution' },
    { key: 'bezubaan', icon: '\u{1F43E}', name: 'Mission Bezubaan', desc: 'Animal Feeding Center, Biscuit, Milk & Pedigree Distribution for stray animals' },
  ];
  const addMission = (key) => setCartQty(prev => ({ ...prev, [key]: 1 }));
  const removeMission = (key) => setCartQty(prev => ({ ...prev, [key]: 0 }));
  const changeQty = (key, delta) => setCartQty(prev => ({ ...prev, [key]: Math.max(1, prev[key] + delta) }));
  const priceOf = (key) => {
    const item = basketMissions.find((m) => m.key === key);
    return item?.price ?? UNIT_PRICE[key] ?? 0;
  };
  const basketTotal = Object.keys(cartQty).reduce((s, k) => s + cartQty[k] * priceOf(k), 0);
  const proceedDonate = () => {
    if (basketTotal === 0) { setShowEmptyMsg(true); setTimeout(() => setShowEmptyMsg(false), 3000); return; }
    if (!basketName) { alert('Please enter your name.'); return; }
    if (!basketEmail) { alert('Please enter your email.'); return; }
    if (!basketPhone || basketPhone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: basketTotal * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + basketTotal + '&name=' + encodeURIComponent(basketName);
      },
      prefill: { name: basketName, email: basketEmail, contact: '+91' + basketPhone },
      notes: { missions: items },
      theme: { color: '#315371' }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handleGooglePay = () => {
    if (basketTotal === 0) { setShowEmptyMsg(true); setTimeout(() => setShowEmptyMsg(false), 3000); return; }
    if (!basketName) { alert('Please enter your name.'); return; }
    if (!basketEmail) { alert('Please enter your email.'); return; }
    if (!basketPhone || basketPhone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    const items = Object.entries(cartQty).filter(([, q]) => q > 0).map(([k, q]) => k + 'x' + q).join(', ');
    const rzp = new window.Razorpay({
      key: 'rzp_live_StUN8QoR2STezo',
      amount: basketTotal * 100,
      currency: 'INR',
      name: 'Being Sevak Charitable Trust',
      description: 'Donation - ' + items,
      image: '../logo11.png',
      handler: function (response) {
        window.location.href = 'payment/success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + basketTotal + '&name=' + encodeURIComponent(basketName);
      },
      prefill: { name: basketName, email: basketEmail, contact: '+91' + basketPhone },
      notes: { missions: items },
      theme: { color: '#315371' },
      config: { display: { blocks: { upi: { instruments: [{ method: 'upi' }] } }, preferences: { show_default_blocks: true } } }
    });
    rzp.on('payment.failed', function (response) {
      window.location.href = 'payment/failure.html?error=' + encodeURIComponent(response.error.description);
    });
    rzp.open();
  };

  const handleBasketPhoneChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 10) {
      val = val.slice(0, 10);
      setBasketPhoneErr('Phone number must contain 10 digits.');
      setTimeout(() => setBasketPhoneErr(''), 2000);
      return;
    }
    setBasketPhone(val);
    setBasketPhoneErr('');
  };

  const handleBasketNameChange = (e) => {
    const val = e.target.value;
    if (/[^a-zA-Z\s]/.test(val)) {
      setBasketNameErr('Invalid name');
      setTimeout(() => setBasketNameErr(''), 2000);
      return;
    }
    setBasketName(val);
    setBasketNameErr('');
  };

  const handleBasketEmailChange = (e) => {
    const val = e.target.value;
    if (/[^a-zA-Z0-9@.]/.test(val)) {
      return;
    }
    setBasketEmail(val);
    setBasketEmailErr('');
  };

  const openModal = (idx) => {
    const data = monthData[idx];
    if (!data || !data.img) return;
    setCurrentMonthIdx(idx);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const prevMonth = () => {
    let idx = currentMonthIdx;
    do {
      idx = idx === 0 ? monthData.length - 1 : idx - 1;
    } while (!monthData[idx].img && idx !== currentMonthIdx);
    if (monthData[idx].img) {
      setCurrentMonthIdx(idx);
    }
  };

  const nextMonth = () => {
    let idx = currentMonthIdx;
    do {
      idx = idx === monthData.length - 1 ? 0 : idx + 1;
    } while (!monthData[idx].img && idx !== currentMonthIdx);
    if (monthData[idx].img) {
      setCurrentMonthIdx(idx);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = monthData[currentMonthIdx].img;
    link.download = monthData[currentMonthIdx].label.replace(/\s+/g, '_') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevMonth();
      if (e.key === 'ArrowRight') nextMonth();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  // Animated counter helper
  const animateCounter = (target) => {
    if (!impactAnimated) return '0';
    return target;
  };

  return (
    <>
      <style>{`
        .basket-overlay{position:fixed;inset:0;background:rgba(30,51,71,0.45);z-index:10001}
        .basket-panel{position:fixed;top:0;right:-480px;width:460px;max-width:100vw;height:100vh;background:#fff;z-index:10002;display:flex;flex-direction:column;box-shadow:-4px 0 30px rgba(0,0,0,0.18);transition:right 0.35s cubic-bezier(.4,0,.2,1);font-family:'Open Sans',sans-serif;overflow:hidden}
        .basket-panel.open{right:0}
        .basket-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:2px solid #e6f7fd;flex-shrink:0;background:#fff}
        .basket-title{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:800;color:#315371;letter-spacing:1px;margin:0}
        .basket-close{background:none;border:none;font-size:18px;color:#315371;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.15s}
        .basket-close:hover{background:#e6f7fd}
        .basket-scroll{flex:1;overflow-y:auto;display:flex;flex-direction:column}
        .b-mission-card{display:flex;align-items:flex-start;gap:12px;padding:14px 20px;border-bottom:1px solid #eef5f8;transition:background 0.15s}
        .b-mission-card:hover{background:#f6fbfc}
        .b-mission-card.in-cart{background:#e6f7fd;border-left:3px solid #00A3DA}
        .b-mission-icon{font-size:22px;flex-shrink:0;width:42px;height:42px;background:#e6f7fd;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .b-mission-info{flex:1;min-width:0}
        .b-mission-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;margin-bottom:4px}
        .b-mission-desc{font-size:11.5px;color:#666;line-height:1.5}
        .b-mission-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;min-width:80px}
        .b-mission-price{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#315371}
        .b-mission-qty-row{display:none;align-items:center;gap:8px;background:white;border:1.5px solid #00A3DA;border-radius:20px;padding:3px 8px}
        .b-mission-card.in-cart .b-mission-qty-row{display:flex}
        .b-qty-btn{background:none;border:none;color:#315371;font-size:10px;cursor:pointer;padding:2px 3px;border-radius:3px;transition:background 0.1s}
        .b-qty-btn:hover{background:#e6f7fd}
        .b-qty-val{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;min-width:20px;text-align:center}
        .b-add-btn{background:#00A3DA;color:white;border:none;padding:6px 14px;border-radius:4px;font-size:12px;font-weight:700;font-family:'Montserrat',sans-serif;cursor:pointer;transition:background 0.15s}
        .b-add-btn:hover{background:#0088bb}
        .b-mission-card.in-cart .b-add-btn{display:none}
        .b-remove-btn{background:none;border:none;color:#e53935;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:3px;padding:2px 0;font-family:'Montserrat',sans-serif}
        .b-remove-btn:hover{text-decoration:underline}
        .b-mission-card.in-cart .b-remove-btn{display:flex !important}
        .basket-divider{height:1px;background:#e6f7fd;margin:0 20px;flex-shrink:0}
        .basket-personal{padding:14px 20px 8px;flex-shrink:0}
        .basket-section-title{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:700;color:#315371;margin-bottom:10px}
        .basket-input{width:100%;border:1.5px solid #c8dce6;border-radius:6px;padding:9px 12px;font-size:13px;font-family:'Open Sans',sans-serif;color:#333;margin-bottom:8px;outline:none;transition:border-color 0.2s;box-sizing:border-box}
        .basket-input:focus{border-color:#00A3DA}
        .basket-phone-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .phone-flag{background:#f0f8fc;border:1.5px solid #c8dce6;border-radius:6px;padding:9px 10px;font-size:13px;white-space:nowrap;flex-shrink:0}
        .phone-inp{margin-bottom:0 !important;flex:1}
        .basket-checkboxes{padding:6px 20px 10px;flex-shrink:0}
        .basket-check{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#555;margin-bottom:7px;cursor:pointer;line-height:1.5}
        .basket-check input[type="checkbox"]{accent-color:#00A3DA;width:14px;height:14px;flex-shrink:0;margin-top:2px}
        .basket-footer{padding:16px 20px 28px;border-top:2px solid #e6f7fd;background:#f6fbfc;margin-top:auto}
        .basket-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
        .basket-total-label{font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:#315371}
        .basket-total-amt{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;color:#315371}
        .gpay-btn{width:100%;background:#000;color:white;border:none;padding:14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:16px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-bottom:10px;transition:background 0.2s;letter-spacing:0.5px}
        .gpay-btn:hover{background:#1a1a1a}
        .basket-donate-btn{width:100%;background:#315371;color:white;border:none;padding:14px;border-radius:6px;font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s;letter-spacing:0.5px}
        .basket-donate-btn:hover{background:#00A3DA}
        .basket-empty-msg{display:none;text-align:center;color:#e53935;font-size:12px;margin-top:8px;font-family:'Montserrat',sans-serif}
        .basket-empty-msg.show{display:block}
        .basket-field-err{display:block;color:#e53935;font-size:11px;margin-top:4px;font-family:'Open Sans',sans-serif;padding-left:80px}
        .slide-content{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 8%;text-align:left;background:linear-gradient(to right,rgba(3,22,62,0.66),rgba(3,22,62,0.18) 60%,transparent)}
        .slide-title{font-family:'Montserrat',sans-serif;font-size:2.6rem;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.15;margin-bottom:10px;max-width:760px}
        .slide-subtitle{font-family:'Open Sans',sans-serif;font-size:1.1rem;color:#eaf4fb;max-width:640px;margin-bottom:18px;line-height:1.6}
        .slide-cta{display:inline-block;background:#00A3DA;color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:0.9rem;padding:12px 28px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;text-decoration:none;transition:background 0.2s}
        .slide-cta:hover{background:#315371}
        .slide-bg-mobile{display:none}
        @media(max-width:768px){.slide-title{font-size:1.5rem}.slide-subtitle{font-size:0.95rem}.slide-content{padding:0 6%}.slide-bg-mobile{display:block}}
        @media(max-width:500px){.basket-panel{width:100vw}}
      `}</style>

      {/* BEING SEVAK CHARITABLE TRUST ALERT BANNER */}
      <div className="alert-banner">
        <span className="alert-text">{siteName}</span>
        <Link to="/about" className="alert-link">Learn More</Link>
      </div>

      {/* QUICK DONATE BAR */}
      <div className="quick-donate-bar">
        <div className="qd-inner">
          <div className="currency-select">
            <span className="flag">🇮🇳</span>
            <span className="cur-code">INR</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="amount-input-wrap">
            <input
              type="number"
              placeholder="Amount"
              className="amount-input"
              value={quickAmt}
              onChange={(e) => setQuickAmt(e.target.value)}
            />
          </div>
          <button className={`preset-amt ${activePreset === 100 ? 'active' : ''}`} onClick={() => handlePresetClick(100)}>₹100 INR</button>
          <button className={`preset-amt ${activePreset === 150 ? 'active' : ''}`} onClick={() => handlePresetClick(150)}>₹150 INR</button>
          <button className={`preset-amt ${activePreset === 200 ? 'active' : ''}`} onClick={() => handlePresetClick(200)}>₹200 INR</button>
          <button className={`preset-amt ${activePreset === 500 ? 'active' : ''}`} onClick={() => handlePresetClick(500)}>₹500 INR</button>
          <div className="payment-icons">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" className="pay-icon"
              onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">PayPal</span>'; }} />
            <span className="pay-icon-text">VISA</span>
            <span className="pay-icon-text mc">MC</span>
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="Apple Pay"
              className="pay-icon" onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">Apple Pay</span>'; }} />
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlepay.svg" alt="Google Pay"
              className="pay-icon" onError={(e) => { e.target.outerHTML = '<span class="pay-icon-fb">G Pay</span>'; }} />
          </div>
          <div className="quick-donate-pulse-wrap">
            <div className="quick-donate-pulse-ring"></div>
            <div className="quick-donate-pulse-ring ring2"></div>
            <button className="quick-donate-btn" onClick={handleQuickDonate}>QUICK DONATE</button>
          </div>
        </div>
      </div>

      {/* HERO BANNER / SLIDESHOW */}
      <section className="hero-slider">
        {liveHero
          ? cmsSlides.map((s, i) => (
              <div className={`slide ${currentSlide === i ? 'active' : ''}`} key={s.id || i}>
                <div
                  className="slide-bg"
                  style={{ backgroundImage: `url(${s.imageUrl})` }}
                ></div>
                {s.mobileImageUrl && (
                  <div
                    className="slide-bg slide-bg-mobile"
                    style={{ backgroundImage: `url(${s.mobileImageUrl})` }}
                  ></div>
                )}
                {(s.title || s.subtitle || s.ctaLabel) && (
                  <div className="slide-content">
                    {s.title && <h2 className="slide-title">{s.title}</h2>}
                    {s.subtitle && <p className="slide-subtitle">{s.subtitle}</p>}
                    {s.ctaLabel && s.ctaUrl && (
                      <a href={s.ctaUrl} className="slide-cta">{s.ctaLabel}</a>
                    )}
                  </div>
                )}
              </div>
            ))
          : (
            <>
        <div className={`slide ${currentSlide === 0 ? 'active' : ''}`} id="slide1">
          <div className="slide-bg slide-bg-1"></div>
        </div>
        <div className={`slide ${currentSlide === 1 ? 'active' : ''}`} id="slide2">
          <div className="slide-bg slide-bg-2"></div>
        </div>
        <div className={`slide ${currentSlide === 2 ? 'active' : ''}`} id="slide3">
          <div className="slide-bg slide-bg-3"></div>
        </div>
        <div className={`slide ${currentSlide === 3 ? 'active' : ''}`} id="slide4">
          <div className="slide-bg slide-bg-4"></div>
        </div>
        <div className={`slide ${currentSlide === 4 ? 'active' : ''}`} id="slide5">
          <div className="slide-bg slide-bg-5"></div>
        </div>
        <div className={`slide ${currentSlide === 5 ? 'active' : ''}`} id="slide6">
          <div className="slide-bg slide-bg-6"></div>
        </div>
        <div className={`slide ${currentSlide === 6 ? 'active' : ''}`} id="slide7">
          <div className="slide-bg slide-bg-7"></div>
        </div>
        <div className={`slide ${currentSlide === 7 ? 'active' : ''}`} id="slide8">
          <div className="slide-bg slide-bg-8"></div>
        </div>
            </>
          )}
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-dots">
            {[...Array(totalSlides)].map((_, i) => (
              <span
                key={i}
                className={`dot ${currentSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              ></span>
            ))}
          </div>
          <button className="slider-arrow next" onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-left">
          <div className="single-image-box">
            <img src={aboutImage} alt={aboutImageAlt} className="about-img" />
          </div>
        </div>
        <div className="about-right">
          <h2>{aboutHeading}</h2>
          <p>
            {aboutDesc ||
              'Being Sevak Charitable Trust is a national non-profit organization serving society since 2015 through healthcare, education, women empowerment, vocational training, and child development, inspired by the vision of "Sevak Bano" and selfless service.'}
          </p>
          <div className="about-boxes">
            <div className="about-box">
              <h3>{aboutVisionTitle}</h3>
              <p>{aboutVisionText}</p>
            </div>
            <div className="about-box">
              <h3>{aboutMissionTitle}</h3>
              <p>{aboutMissionText}</p>
            </div>
          </div>
          <Link to="/about" className="read-btn">{aboutReadMoreLabel}</Link>
        </div>
      </section>

      {/* CIRCLE MARQUEE SECTION */}
      <section className="logo-marquee-section">
        <div className="marquee">
          <div className="marquee-content">
            {marqueeItems.map((item, i) => (
              <div className="circle-box" key={i}>
                <div className="circle">
                  <img src={item.image} alt="" />
                </div>
                <h2>{item.value}</h2>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENT APPEALS */}
      <section className="causes-section">
        <div className="section-header">
          <h2>{urgentH.head} <span className="accent">{urgentH.tail}</span></h2>
          <p>{urgentDescription}</p>
        </div>
        <div className="causes-marquee">
          <div className="causes-track">
            {[...urgentAppeals, ...urgentAppeals].map((item, i) => (
              <div className="cause-card" key={i}>
                <div className={`cause-img ${item.imageClass}`}></div>
                <div className="cause-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: item.progress }}></div>
                  </div>
                  <div className="cause-meta"><span>{item.funded}</span><span>{item.raised}</span></div>
                  <Link to={item.link} className="cause-btn">Donate Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STORIES */}
      <section className="being-impact-slider">
        <div className="section-header">
          <h2>{impactStoriesH.head} <span className="accent">{impactStoriesH.tail}</span></h2>
          <p>{impactStoriesDescription}</p>
        </div>
        <div className="being-slider-box">
          {impactStories.map((item, i) => (
            <Link to={item.link} className={`being-slide ${currentImpact === i ? 'active' : ''}`} key={i}>
              <img src={item.image} alt={item.alt} />
              <div className="being-text">
                <h3>{item.title}</h3>
                <p>Read More</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="being-dots">
          {[...Array(totalImpactSlides)].map((_, i) => (
            <span
              key={i}
              className={`being-dot ${currentImpact === i ? 'active' : ''}`}
              onClick={() => setCurrentImpact(i)}
            ></span>
          ))}
        </div>
      </section>

      {/* MOST NEEDED CAUSES */}
      <section className="causes-section">
        <div className="section-header">
          <h2>{mostNeededH.head} <span className="accent">{mostNeededH.tail}</span></h2>
          <p>{mostNeededDescription}</p>
        </div>
        <div className="causes-grid">
          {mostNeededCauses.map((item, i) => (
            <div className="cause-card" key={i}>
              <div className={`cause-img ${item.imageClass}`}></div>
              <div className="cause-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: item.progress }}></div>
                </div>
                <div className="cause-meta"><span>{item.funded}</span><span>{item.raised}</span></div>
                <Link to={item.link} className="cause-btn">Donate Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT EDUCATION */}
      <section className="donation-section">
        <div className="donation-images">
          <div className="img-box img1">
            <img src={eduImage} alt="" />
          </div>
        </div>
        <div className="donation-content">
          <span className="small-title">
            <h3>{eduTitle}</h3>
          </span>
          <h1>
            {eduSubtitle}
          </h1>
          <div className="info-card">
            <h3>{eduPrice}</h3>
          </div>
          <div className="info-card second-card">
            <p>{eduDescription}</p>
          </div>
          <a href={eduButtonUrl} className="give-btn-btn">{eduButtonLabel}</a>
        </div>
      </section>

      {/* EYE HEALTH PROGRAMME */}
      <section className="eye-health-slide">
        <div className="eye-img">
          <img src={eyeImage} alt="Eye Health" />
        </div>
        <div className="eye-content">
          <span className="tag">{eyeTag}</span>
          <h2>
            {eyeHeading}
          </h2>
          <p>
            {eyeDescription}
          </p>
          <div className="stats">
            {eyeStats.map((s, i) => (
              <div className="stat-box" key={i}>
                <h3>{s.value}</h3>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <Link to={eyeButtonUrl} className="donate-btn">
            {eyeButtonLabel}
          </Link>
        </div>
      </section>

      {/* CELEBRITY NOTES */}
      <section className="celebrity-section">
        <div className="section-header">
          <h2>{celebrityH.head} <span className="accent">{celebrityH.tail}</span></h2>
          <p>{celebrityDescription}</p>
        </div>
        <div className="celebrity-slider-box">
          {celebritySlides.map((slide, si) => (
            <div className={`celebrity-slide ${currentSlide % 2 === si ? 'active' : ''}`} key={si}>
              {slide.map((src, ci) => (
                <div className="celebrity-card" key={ci}>
                  <img src={src} alt={`Celebrity Note ${si * 2 + ci + 1}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="celebrity-dots">
          <span className={`celebrity-dot ${currentSlide % 2 === 0 ? 'active' : ''}`}></span>
          <span className={`celebrity-dot ${currentSlide % 2 === 1 ? 'active' : ''}`}></span>
        </div>
      </section>

      {/* METRO STATION INITIATIVE */}
      <section className="metro-section">
        <div className="metro-box">
          <div className="metro-images">
            <div className="metro-hero-img">
              <img src={metroImage} alt="Metro Station Initiative" />
              <div className="metro-hero-overlay"></div>
            </div>
            <div className="metro-image-grid">
              {metroItems.map((item, i) => (
                <div className="metro-img-box" key={i}>
                  <div className="metro-img-wrapper">
                    <img src={item.image} alt={item.label} />
                    <span className="metro-img-label">{item.label}</span>
                  </div>
                  <div className="metro-img-footer">
                    <h3 className="metro-price">{item.price}</h3>
                    <Link to={item.link} className="metro-donate-btn">{item.buttonLabel}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="metro-content">
            <h2>{metroHeading}</h2>
            <div className="metro-line"></div>
            {metroParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="promise-xection">
        <div className="promise-box">
          <div className="promise-logo">
            <img src={promiseImage} alt="NGO Logo" />
          </div>
          <div className="promise-content">
            <h2>{promiseHeading}</h2>
            <div className="promise-line"></div>
            {promiseParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* OUR ACTIVITIES */}
      <section className="how-we-work">
        <div className="section-header">
          <h2>{activitiesH.head} <span className="accent">{activitiesH.tail}</span></h2>
          <p>{activitiesDescription}</p>
        </div>
        <div className="slider-wrapper">
          <div className="slider-track">
            {activitiesItems.map((item, i) => (
              <div className="circle-card" key={i}>
                <img src={item.image} alt="" />
                <h3>{item.title}</h3>
                <p className="circle-desc">{item.description}</p>
                <a href="#" className="circle-read-more">Read More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PARTNERS */}
      <section className="projects-section">
        <div className="projects-hero">
          <img src="banner.jpg" alt="Our Partners" />
          <div className="overlay">
            <h1>{partnersH.head} <span>{partnersH.tail}</span></h1>
            <p>{partnersDescription}</p>
          </div>
        </div>
        <div className="partners-marquee">
          <div className="partners-track">
            <div className="projects-grid">
              {partnersImages.map((src, i) => (
                <div className="project-card" key={i}><img src={'images/'+src} alt="" /></div>
              ))}
            </div>
            <div className="projects-grid duplicate">
              {partnersImages.map((src, i) => (
                <div className="project-card" key={'d'+i}><img src={'images/'+src} alt="" /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="impact-section" ref={impactRef}>
        <div className="impact-inner">
          <div className="impact-title">
            <h2>{statsH.head} <span className="accent-light">{statsH.tail}</span></h2>
            <p>{statsDescription}</p>
          </div>
          <div className="stats-grid">
            {statsItems.map((it, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-num" data-target={it.value}>{impactAnimated ? it.value : '0'}</span>
                <span className="stat-label">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <br />

      {/* DONOR TESTIMONIALS */}
      <section className="donor-testimonial-section">
        <div className="section-title">
          <h2>{testimonialsHeading}</h2>
          <p>{testimonialsDescription}</p>
        </div>
        <div className="testimonial-track">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="quote">❝</div>
              <p>{t.quote}</p>
              <div className="donor-info">
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section className="how-we-work">
        <div className="section-header">
          <h2>{updatesH.head} <span className="accent">{updatesH.tail}</span></h2>
          <p>{latestUpdatesDescription}</p>
        </div>
        <div className="month-updates">
          <div className="month-tabs">
            {monthData.map((m, idx) => (
              <button
                key={m.id}
                className={`month-tab ${currentMonthIdx === idx && modalOpen ? 'checked' : ''}`}
                onClick={() => openModal(idx)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MONTH MODAL */}
      <div className={`month-modal ${modalOpen ? 'open' : ''}`}>
        <div className="month-modal-overlay" onClick={closeModal}></div>
        <div className="month-modal-content">
          <button className="month-modal-close" onClick={closeModal}><i className="fas fa-times"></i></button>
          <button className="month-modal-download" title="Download Image" onClick={handleDownload}><i className="fas fa-download"></i></button>
          <button className="month-modal-nav prev" onClick={prevMonth}><i className="fas fa-chevron-left"></i></button>
          <button className="month-modal-nav next" onClick={nextMonth}><i className="fas fa-chevron-right"></i></button>
          <img src={monthData[currentMonthIdx].img} alt="Monthly Update" />
          <div className="month-modal-caption">{monthData[currentMonthIdx].label}</div>
        </div>
      </div>

      {/* FEATURED PROJECTS */}
      <section className="featured-section">
        <div className="section-header">
          <h2>{featuredProjectsH.head} <span className="accent">{featuredProjectsH.tail}</span></h2>
          <p>{featuredProjectsDescription}</p>
        </div>
        <div className="featured-slider-box" ref={featuredSliderRef}>
          {featuredProjects.map((slide, si) => (
            <div className={`featured-slide ${currentFeatured === si ? 'active' : ''}`} key={si}>
              {slide.cards.map((card, ci) => (
                <div className="featured-card" key={ci}>
                  <div className="feat-img" style={{ backgroundImage: `url('${card.image}')` }}></div>
                  <div className="feat-overlay">
                    <span className="feat-tag">{card.tag}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <Link to={card.link} className="feat-btn">{card.button}</Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="featured-dots">
          {[...Array(totalFeaturedSlides)].map((_, i) => (
            <span
              key={i}
              className={`featured-dot ${currentFeatured === i ? 'active' : ''}`}
              onClick={() => { setCurrentFeatured(i); scrollToFeaturedSlide(i); }}
            ></span>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="nl-text">
            <h2>Stay <span className="accent">Connected</span></h2>
            <p>Get updates on our projects, campaigns and impact stories</p>
          </div>
          <div className="nl-form">
            <input type="email" placeholder="Enter your email address" className="nl-input" />
            <button className="nl-btn">SUBSCRIBE</button>
          </div>
        </div>
      </section>

      {/* Donation Basket Overlay */}
      {basketOpen && <div className="basket-overlay" onClick={() => setBasketOpen(false)}></div>}

      {/* Donation Basket Panel */}
      <div className={`basket-panel${basketOpen ? ' open' : ''}`}>
        <div className="basket-header">
          <h2 className="basket-title">YOUR DONATION BASKET</h2>
          <button className="basket-close" onClick={() => setBasketOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="basket-scroll">
          {basketMissions.map(m => (
            <div key={m.key} className={`b-mission-card${cartQty[m.key] > 0 ? ' in-cart' : ''}`}>
              <div className="b-mission-icon">{m.icon}</div>
              <div className="b-mission-info">
                <div className="b-mission-name">{m.name}</div>
                <div className="b-mission-desc">{m.desc}</div>
              </div>
              <div className="b-mission-right">
                <div className="b-mission-price">{cartQty[m.key] > 0 ? `\u20B9${(cartQty[m.key] * priceOf(m.key)).toLocaleString('en-IN')}` : '\u20B90'}</div>
                <div className="b-mission-qty-row">
                  <button className="b-qty-btn" onClick={() => changeQty(m.key, -1)}><i className="fas fa-minus"></i></button>
                  <span className="b-qty-val">{cartQty[m.key]}</span>
                  <button className="b-qty-btn" onClick={() => changeQty(m.key, 1)}><i className="fas fa-plus"></i></button>
                </div>
                <button className="b-add-btn" onClick={() => addMission(m.key)}>Add</button>
              </div>
            </div>
          ))}
          <div className="basket-divider"></div>
          <div className="basket-personal">
            <h3 className="basket-section-title">Your Details</h3>
            <input type="text" className="basket-input" placeholder="Enter your name" value={basketName} onChange={handleBasketNameChange} />
            {basketNameErr && <span className="basket-field-err">{basketNameErr}</span>}
            <div className="basket-phone-row">
              <span className="phone-flag">&#127470;&#127475; +91</span>
              <input type="tel" className="basket-input phone-inp" placeholder="Phone number" value={basketPhone} onChange={handleBasketPhoneChange} />
            </div>
            {basketPhoneErr && <span className="basket-field-err">{basketPhoneErr}</span>}
            <input type="email" className="basket-input" placeholder="Enter your email" value={basketEmail} onChange={handleBasketEmailChange} />
            {basketEmailErr && <span className="basket-field-err">{basketEmailErr}</span>}
          </div>
          <div className="basket-checkboxes">
            <label className="basket-check"><input type="checkbox" /> Send me impact updates via email</label>
            <label className="basket-check"><input type="checkbox" /> Send me WhatsApp/SMS updates</label>
            <label className="basket-check"><input type="checkbox" /> I have read and understood the <Link to="/terms" style={{color:'#00A3DA'}}>donation policy</Link></label>
          </div>
          <div className="basket-footer">
            <div className="basket-total-row">
              <span className="basket-total-label">Total</span>
              <span className="basket-total-amt">{'\u20B9'}{basketTotal.toLocaleString('en-IN')} INR</span>
            </div>
            <button className="gpay-btn" onClick={handleGooglePay}>Google Pay</button>
            <button className="basket-donate-btn" onClick={proceedDonate}>
              <i className="fas fa-heart"></i> Donate Now
            </button>
            <p className={`basket-empty-msg${showEmptyMsg ? ' show' : ''}`}>Please add at least one mission to donate.</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
}
