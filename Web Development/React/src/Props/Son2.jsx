const Son2 = ({ land, home }) => {
  return (
    <div className="card son">
      <h2>{home.son}</h2>
      <p>Land: <span className="land">{land}</span></p>
      <p>Location: <span className="location">{home.location}</span></p>
      <p>Price: <span className="price">₹{home.price}</span></p>
    </div>
  );
};

export default Son2;