import { Link } from "react-router-dom";

const programs = [
  {
    title: "Help For Ration Bag",
    category: "Support for Daily Wagers",
    desc: "Providing ration kits and essential groceries to families facing food insecurity.",
    image: "/images/education/ration.jpg",
  },
  {
    title: "Help Education Material",
    category: "Support Can Bring A Smile",
    desc: "Distributing school bags, notebooks, stationery, and learning materials to children.",
    image: "/images/education/material.jpg",
  },
  {
    title: "Help For School Meal",
    category: "Support for Children",
    desc: "Providing nutritious meals to underprivileged school children for better health and learning.",
    image: "/images/education/meal.jpg",
  },
  {
    title: "Women Empowerment Program",
    category: "Support for Women",
    desc: "Skill development and vocational training programs helping women become financially independent.",
    image: "/images/education/women.jpg",
  },
];

const EducationSupport = () => {
  return (
    <div className="education-page">

      {/* HERO */}
      <section className="education-hero">
        <div className="education-overlay">
          <h4>Education Support</h4>
          <h1>Ashray Ka Aashra</h1>

          <p>
            Empowering children and families through education,
            nutrition, livelihood support, and women empowerment.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="education-about">
        <h2>About The Program</h2>

        <p>
          Ashray for Life Foundation believes that every child deserves
          access to quality education, nutritious food, and opportunities
          for a brighter future. Through our support initiatives, we help
          children stay in school, provide meals, distribute educational
          materials, and empower women through skill development.
        </p>
      </section>

      {/* OBJECTIVES */}
      <section className="education-mission">
        <h2>Our Focus Areas</h2>

        <div className="mission-grid">
          <div className="mission-box">
            <h3>Education Access</h3>
            <p>
              Providing learning materials and academic support to children.
            </p>
          </div>

          <div className="mission-box">
            <h3>Nutrition Support</h3>
            <p>
              Ensuring children receive healthy meals for growth and learning.
            </p>
          </div>

          <div className="mission-box">
            <h3>Women Empowerment</h3>
            <p>
              Creating sustainable livelihoods through skill development.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAM CARDS */}
      <section className="program-section">
        <h2>Support Initiatives</h2>

        <div className="program-grid">
          {programs.map((item, index) => (
            <div className="program-card" key={index}>
              <img src={item.image} alt={item.title} />

              <div className="program-content">
                <span>{item.category}</span>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

                <Link to="/donate" className="btn-3d">Donate Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="education-cta">
        <h2>Together We Can Change Lives</h2>

        <p>
          Your contribution helps us educate children,
          feed families, and empower women.
        </p>

        <Link to="/donate" className="btn-3d">Support Education</Link>
      </section>

    </div>
  );
};

export default EducationSupport;
