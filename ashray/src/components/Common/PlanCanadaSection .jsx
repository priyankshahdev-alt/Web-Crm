// import { useState } from "react";
// import "../../pages/Home/Home.css";

// const getInvolvedCards = [
//   {
//     type: "circle",
//     img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
//     title: "Become a child sponsor",
//     desc: "Girls at Hope are real girls that go to real projects in the communities where we work. Become a sponsor and help provide education, health care, food, and services for vulnerable children.",
//     btn: "Sponsor now",
//     btnColor: "#0072CE",
//   },
//   {
//     type: "circle",
//     img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop&crop=face",
//     title: "Gifts of Hope",
//     desc: "Gifts of Hope are real gifts that go to real projects in the communities where we work. Browse our catalog and help provide school supplies, food, and services for vulnerable children.",
//     btn: "Give today",
//     btnColor: "#0072CE",
//   },
// ];

// const bannerCards = [
//   {
//     bg: "#E8F4FD",
//     img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=face",
//     title: "Opportunities for youth in Canada",
//     desc: "Initiatives for youth ages 14 – 30 to lead positive change.",
//     link: "+ Learn about youth opportunities",
//     accent: "#0072CE",
//   },
//   {
//     bg: "#003F87",
//     img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=80&h=80&fit=crop",
//     title: "Support urgent causes",
//     desc: "Give to those in need and take part in other events.",
//     link: "+ Support our urgent causes",
//     accent: "#fff",
//     dark: true,
//   },
//   {
//     bg: "#F5A623",
//     img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=80&fit=crop",
//     title: "Corporate partnerships",
//     desc: "Build a thriving corporate giving partnership with us.",
//     link: "+ Learn about corporate partnerships",
//     accent: "#fff",
//     dark: true,
//   },
//   {
//     bg: "#003F87",
//     img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
//     title: "Other ways to give",
//     desc: "Help advance children's rights and equality for girls today.",
//     link: "+ Learn about other ways to give",
//     accent: "#fff",
//     dark: true,
//   },
// ];

// const stories = [
//   {
//     big: true,
//     img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=320&fit=crop",
//     overlay: "Bend It Like Yawa",
//     title: "Girls in Football: A Referee's Story",
//     desc: "What does it take to become a female referee in a male-dominated field? Here's an inspiring story challenging gender norms and opening doors for others.",
//     tag: "Sports",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=240&fit=crop",
//     overlay: "Sudan: A Neglected Crisis",
//     title: "Sudan: What's Happening Now?",
//     category: "Crisis Response & Climate",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=240&fit=crop",
//     overlay: "Climate Change's Unequal Impact",
//     title: "The Unfair Ways Climate Crisis Affects Girls and Women",
//     category: "Crisis Response & Climate",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=240&fit=crop",
//     overlay: "Where Trees Tell Stories",
//     title: "Female-led conservation group fighting deforestation in Kenya's sacred forests",
//     category: "Crisis Response & Climate, Equality & Rights",
//   },
// ];

// export default function PlanCanadaSection() {
//   const [hovered, setHovered] = useState(null);

//   return (
//     <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
//       {/* GET INVOLVED */}
//       <section style={{ padding: "48px 0 32px" }}>
//         <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 6 }}>Get Involved</h2>
//         <p style={{ textAlign: "center", color: "#555", fontSize: 14, marginBottom: 32 }}>
//           See how you can get involved with Plan International Canada today.
//         </p>

//         {/* Circle cards row */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 32 }}>
//           {getInvolvedCards.map((card, i) => (
//             <div key={i} style={{ width: 240, textAlign: "center" }}>
//               <img
//                 src={card.img}
//                 alt={card.title}
//                 style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "4px solid #0072CE", marginBottom: 12 }}
//               />
//               <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 8 }}>{card.title}</h3>
//               <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 14 }}>{card.desc}</p>
//               <button
//                 style={{
//                   background: card.btnColor,
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 20,
//                   padding: "8px 22px",
//                   fontWeight: 600,
//                   fontSize: 13,
//                   cursor: "pointer",
//                   transition: "background 0.2s",
//                 }}
//                 onMouseOver={e => (e.target.style.background = "#4059aa")}
//                 onMouseOut={e => (e.target.style.background = card.btnColor)}
//               >
//                 {card.btn}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Banner cards grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//           {bannerCards.map((card, i) => (
//             <div
//               key={i}
//               onMouseEnter={() => setHovered(i)}
//               onMouseLeave={() => setHovered(null)}
//               style={{
//                 background: card.bg,
//                 borderRadius: 10,
//                 padding: "16px 18px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 14,
//                 cursor: "pointer",
//                 transform: hovered === i ? "translateY(-2px)" : "none",
//                 boxShadow: hovered === i ? "0 6px 20px rgba(0,0,0,0.13)" : "none",
//                 transition: "all 0.2s",
//               }}
//             >
//               <img
//                 src={card.img}
//                 alt={card.title}
//                 style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
//               />
//               <div>
//                 <h4 style={{ fontSize: 14, fontWeight: 700, color: card.dark ? "#fff" : "#111", margin: "0 0 4px" }}>{card.title}</h4>
//                 <p style={{ fontSize: 12, color: card.dark ? "rgba(255,255,255,0.8)" : "#555", margin: "0 0 6px", lineHeight: 1.4 }}>{card.desc}</p>
//                 <a href="#" style={{ fontSize: 12, color: card.dark ? "#fff" : "#0072CE", fontWeight: 600, textDecoration: "none" }}>
//                   {card.link}
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* OUR STORIES */}
//       <section style={{ background: "#EAF6FB", borderRadius: 16, padding: "36px 28px", marginBottom: 40 }}>
//         <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 24 }}>Our Stories</h2>

//         {/* Big story */}
//         {stories.filter(s => s.big).map((story, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               borderRadius: 10,
//               overflow: "hidden",
//               background: "#fff",
//               marginBottom: 16,
//               cursor: "pointer",
//               boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
//             }}
//           >
//             <div style={{ position: "relative", minWidth: 220, maxWidth: 260 }}>
//               <img src={story.img} alt={story.overlay} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: "linear-gradient(135deg, rgba(0,63,135,0.82) 0%, rgba(0,114,206,0.55) 100%)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 padding: 16,
//               }}>
//                 <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, textAlign: "center", lineHeight: 1.3 }}>{story.overlay}</span>
//               </div>
//             </div>
//             <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
//               <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 10px" }}>{story.title}</h3>
//               <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: "0 0 14px" }}>{story.desc}</p>
//               <button style={{
//                 alignSelf: "flex-start", background: "#0072CE", color: "#fff",
//                 border: "none", borderRadius: 16, padding: "7px 18px",
//                 fontSize: 12, fontWeight: 600, cursor: "pointer",
//               }}>
//                 Read more
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Small story cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
//           {stories.filter(s => !s.big).map((story, i) => (
//             <div key={i} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
//               <div style={{ position: "relative" }}>
//                 <img src={story.img} alt={story.overlay} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
//                 <div style={{
//                   position: "absolute", inset: 0,
//                   background: "linear-gradient(135deg, rgba(0,63,135,0.75) 0%, rgba(0,114,206,0.45) 100%)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   padding: 12,
//                 }}>
//                   <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, textAlign: "center", lineHeight: 1.3 }}>{story.overlay}</span>
//                 </div>
//               </div>
//               <div style={{ padding: "12px 12px 14px" }}>
//                 <p style={{ fontSize: 12, fontWeight: 700, color: "#111", margin: "0 0 6px", lineHeight: 1.4 }}>{story.title}</p>
//                 <p style={{ fontSize: 11, color: "#888", margin: "0 0 10px" }}>{story.category}</p>
//                 <button style={{
//                   background: "#0072CE", color: "#fff",
//                   border: "none", borderRadius: 14, padding: "5px 14px",
//                   fontSize: 11, fontWeight: 600, cursor: "pointer",
//                 }}>
//                   Read more
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../pages/Home/Home.css";

const getInvolvedCards = [
  {
    type: "circle",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
    title: "Become a Volunteer",
    desc: "Become a volunteer and make a meaningful difference in the lives of those in need.",
    btn: " Join Now",
    btnColor: "#00236f",
  },
  {
    type: "circle",
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=300&fit=crop&crop=face",
    title: " Support Our Mission",
    desc: " Help us bring hope, support, and opportunities to communities in need",
    btn: " Donate Today",
    btnColor: "#00236f",
  },
];

const bannerCards = [
  {
    bg: "#4059aa",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop&crop=face",
      title: "Sunil Khedekar",
    desc: "Supporting Ashray For Life Foundation has been a truly rewarding experience. Their commitment to helping vulnerable communities is inspiring.",
    // link: "+ Learn about youth opportunities",
    accent: "#0072CE",
  },
  {
    bg: "#F5A623",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&h=100&fit=crop",
       title: "janvi Patel",
    desc: "I am proud to support an organization that creates meaningful change through education, healthcare, and community development.",
    // link: "+ Support our urgent causes",
    accent: "#fff",
    dark: true,
  },
  {
    bg: "#F5A623",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop",
       title: "Amit Verma",
    desc: "The transparency and dedication shown by the team give me confidence that every contribution is making a real difference.",
    // link: "+ Learn about corporate partnerships",
    accent: "#fff",
    dark: true,
  },
  {
    bg: "#4059aa",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
        title: "Kalpesh Parmar",
    desc: "Ashray For Life Foundation is transforming lives with compassion and care. I am honored to be one of its supporters.",
    // link: "+ Learn about other ways to give",
    accent: "#fff",
    dark: true,
  },
];

const stories = [
  {
    big: true,
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&h=420&fit=crop",
    overlay: "Bend It Like Yawa",
    title: "Providing Shelter, Dignity, and Hope",
    desc: "Every individual deserves a safe place to live and the opportunity to thrive. Ashray Foundation works to support vulnerable communities with care, compassion, and essential resources",
  },
  {
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=300&fit=crop",
    overlay: "Sudan: A Neglected Crisis",
    title: "Creating Brighter Futures Through Education",
    category: "Education & Learning",
  },
  {
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop",
    overlay: "Climate Change Impact",
    title: "Empowering Women, Strengthening Communities",
    category: "Women & Empowerment",
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop",
    overlay: "Forest Conservation",
    title: "Together We Create Lasting Change",
    category: "Community & Volunteering",
  },
];

const blogPosts = [
  {
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
    title: "Money Donation: A Complete Guide to Giving",
    date: "06 Jun 2026",
    link: "/blog/money-donation-a-complete-guide-to-giving/",
  },
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    title: "Names of Charities in India | Riddhi Siddhi Charitable Trust",
    date: "14 May 2026",
    link: "/blog/names-of-charities-in-india-riddhi-siddhi-charitable-trust/",
  },
  {
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
    title: "Cow Shelter in Mumbai for Animal Welfare Support",
    date: "14 May 2026",
    link: "/blog/cow-shelter-in-mumbai-for-animal-welfare-support/",
  },
];

export default function PlanCanadaSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#f7f9fb",
        padding: "40px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>

        {/* GET INVOLVED */}
        <section style={{ padding: "20px 0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800 }}>
             Get Involved With Us
          </h2>
          <p style={{ textAlign: "center", color: "#555", fontSize: 16, marginBottom: 40 }}>
            Together, we can create lasting change and build a brighter future for communities in need.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 80, flexWrap: "wrap" }}>
            {getInvolvedCards.map((card, i) => (
              <div key={i} style={{ width: 190, textAlign: "center" }}>
                <img
                  src={card.img}
                  alt={card.title}
                  style={{
                    width: 210,
                    height: 210,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "5px solid #4059aa",
                    marginBottom: 14,
                  }}
                />
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                  {card.desc}
                </p>
                <Link to="/donate" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      marginTop: 10,
                      background: card.btnColor,
                      color: "#fff",
                      border: "none",
                      borderRadius: 25,
                      padding: "10px 26px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {card.btn}
                  </button>
                </Link>
              </div>
            ))}
          </div>
          


          <div>
            <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800 ,padding: "30px 0 20px"  }}>
             Our Supporters
          </h2>
        
          {/* Banner */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 0 }}>   
            {bannerCards.map((card, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: card.bg,
                  borderRadius:  "40px 0px 40px 0px",
                  padding: 22,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  transform: hovered === i ? "translateY(-4px)" : "none",
                  boxShadow: hovered === i ? "0 10px 25px rgba(0,0,0,0.15)" : "none",
                  transition: "0.3s",
                }}
              >
                {/* <img
                  src={card.img}
                  style={{ width: 70, height: 70, borderRadius: "50%" }}
                /> */}
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: card.dark ? "#fff" : "#fff" }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: 13, color: card.dark ? "#000" : "#000" }}>
                    {card.desc}
                  </p>
                  <a href="#" style={{ color: card.dark ? "#fff" : "#0072CE", fontWeight: 600 }}>
                    {card.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>  
        </section>

        {/* BLOG CARDS */}
        <section className="blog-section">
          <div className="blog-section__header">
            <h2 className="blog-section__title">
              Our Latest Articles
            </h2>
            <p className="blog-section__subtitle">
              News &amp; Blog
            </p>
          </div>

          <div className="blog-track">
            {blogPosts.map((post, i) => (
              <div key={i} className="blog-card">
                <div className="blog-card__inner">
                  <div className="blog-card__image">
                    <img src={post.image} alt={post.title} />
                    <img src={post.image} alt={post.title} />
                    <a href={post.link} className="blog-card__image__link">
                      <span className="sr-only">{post.title}</span>
                    </a>
                    <div className="blog-card__date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {post.date}
                    </div>
                  </div>
                  <div className="blog-card__body">
                    <h3 className="blog-card__title">
                      <a href={post.link}>{post.title}</a>
                    </h3>
                    <div className="blog-card__link">
                      <a href={post.link}>
                        <span className="blog-card__link-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4059aa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}