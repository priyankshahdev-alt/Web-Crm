import { useState } from "react";
import "../../pages/Home/Home.css";

const getInvolvedCards = [
  {
    type: "circle",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    title: "Become a child sponsor",
    desc: "Girls at Hope are real girls that go to real projects in the communities where we work. Become a sponsor and help provide education, health care, food, and services for vulnerable children.",
    btn: "Sponsor now",
    btnColor: "#0072CE",
  },
  {
    type: "circle",
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop&crop=face",
    title: "Gifts of Hope",
    desc: "Gifts of Hope are real gifts that go to real projects in the communities where we work. Browse our catalog and help provide school supplies, food, and services for vulnerable children.",
    btn: "Give today",
    btnColor: "#0072CE",
  },
];

const bannerCards = [
  {
    bg: "#E8F4FD",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop&crop=face",
    title: "Opportunities for youth in Canada",
    desc: "Initiatives for youth ages 14 – 30 to lead positive change.",
    link: "+ Learn about youth opportunities",
    accent: "#0072CE",
  },
  {
    bg: "#003F87",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=80&h=80&fit=crop",
    title: "Support urgent causes",
    desc: "Give to those in need and take part in other events.",
    link: "+ Support our urgent causes",
    accent: "#fff",
    dark: true,
  },
  {
    bg: "#F5A623",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=80&fit=crop",
    title: "Corporate partnerships",
    desc: "Build a thriving corporate giving partnership with us.",
    link: "+ Learn about corporate partnerships",
    accent: "#fff",
    dark: true,
  },
  {
    bg: "#003F87",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
    title: "Other ways to give",
    desc: "Help advance children's rights and equality for girls today.",
    link: "+ Learn about other ways to give",
    accent: "#fff",
    dark: true,
  },
];

const stories = [
  {
    big: true,
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=320&fit=crop",
    overlay: "Bend It Like Yawa",
    title: "Girls in Football: A Referee's Story",
    desc: "What does it take to become a female referee in a male-dominated field? Here's an inspiring story challenging gender norms and opening doors for others.",
    tag: "Sports",
  },
  {
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=240&fit=crop",
    overlay: "Sudan: A Neglected Crisis",
    title: "Sudan: What's Happening Now?",
    category: "Crisis Response & Climate",
  },
  {
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=240&fit=crop",
    overlay: "Climate Change's Unequal Impact",
    title: "The Unfair Ways Climate Crisis Affects Girls and Women",
    category: "Crisis Response & Climate",
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=240&fit=crop",
    overlay: "Where Trees Tell Stories",
    title: "Female-led conservation group fighting deforestation in Kenya's sacred forests",
    category: "Crisis Response & Climate, Equality & Rights",
  },
];

export default function PlanCanadaSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
      {/* GET INVOLVED */}
      <section style={{ padding: "48px 0 32px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#111", marginBottom: 6 }}>Get Involved</h2>
        <p style={{ textAlign: "center", color: "#555", fontSize: 14, marginBottom: 32 }}>
          See how you can get involved with Plan International Canada today.
        </p>

        {/* Circle cards row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 32 }}>
          {getInvolvedCards.map((card, i) => (
            <div key={i} style={{ width: 240, textAlign: "center" }}>
              <img
                src={card.img}
                alt={card.title}
                style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "4px solid #0072CE", marginBottom: 12 }}
              />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 14 }}>{card.desc}</p>
              <button
                style={{
                  background: card.btnColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 22px",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={e => (e.target.style.background = "#4059aa")}
                onMouseOut={e => (e.target.style.background = card.btnColor)}
              >
                {card.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Banner cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {bannerCards.map((card, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: card.bg,
                borderRadius: 10,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transform: hovered === i ? "translateY(-2px)" : "none",
                boxShadow: hovered === i ? "0 6px 20px rgba(0,0,0,0.13)" : "none",
                transition: "all 0.2s",
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: card.dark ? "#fff" : "#111", margin: "0 0 4px" }}>{card.title}</h4>
                <p style={{ fontSize: 12, color: card.dark ? "rgba(255,255,255,0.8)" : "#555", margin: "0 0 6px", lineHeight: 1.4 }}>{card.desc}</p>
                <a href="#" style={{ fontSize: 12, color: card.dark ? "#fff" : "#0072CE", fontWeight: 600, textDecoration: "none" }}>
                  {card.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORIES */}
      <section style={{ background: "#EAF6FB", borderRadius: 16, padding: "36px 28px", marginBottom: 40 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 24 }}>Our Stories</h2>

        {/* Big story */}
        {stories.filter(s => s.big).map((story, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              borderRadius: 10,
              overflow: "hidden",
              background: "#fff",
              marginBottom: 16,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ position: "relative", minWidth: 220, maxWidth: 260 }}>
              <img src={story.img} alt={story.overlay} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(0,63,135,0.82) 0%, rgba(0,114,206,0.55) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 16,
              }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, textAlign: "center", lineHeight: 1.3 }}>{story.overlay}</span>
              </div>
            </div>
            <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 10px" }}>{story.title}</h3>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: "0 0 14px" }}>{story.desc}</p>
              <button style={{
                alignSelf: "flex-start", background: "#0072CE", color: "#fff",
                border: "none", borderRadius: 16, padding: "7px 18px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                Read more
              </button>
            </div>
          </div>
        ))}

        {/* Small story cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {stories.filter(s => !s.big).map((story, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ position: "relative" }}>
                <img src={story.img} alt={story.overlay} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(0,63,135,0.75) 0%, rgba(0,114,206,0.45) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 12,
                }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, textAlign: "center", lineHeight: 1.3 }}>{story.overlay}</span>
                </div>
              </div>
              <div style={{ padding: "12px 12px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111", margin: "0 0 6px", lineHeight: 1.4 }}>{story.title}</p>
                <p style={{ fontSize: 11, color: "#888", margin: "0 0 10px" }}>{story.category}</p>
                <button style={{
                  background: "#0072CE", color: "#fff",
                  border: "none", borderRadius: 14, padding: "5px 14px",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
