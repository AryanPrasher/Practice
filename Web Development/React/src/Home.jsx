import "./Home.css";
import workshopIllustration from "./assets/workshop-illustration.png";

const Home = () => {
  return (
    <div className="home card">
      <img
        className="home-image"
        src={workshopIllustration}
        alt="Abstract illustration of a coding workspace"
      />
      <h1>Welcome to React!</h1>
      <p>Learning React one component at a time.</p>
      <button type="button">Get Started</button>
    </div>
  );
};

export default Home;
