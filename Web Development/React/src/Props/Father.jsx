import Son1 from "./Son1";
import Son2 from "./Son2";

const Father = () => {
  const land = "10 Acres";

  const home1 = {
    location: "Haryana",
    son: "Son 1",
    price: 2000000,
  };

  const home2 = {
    location: "Punjab",
    son: "Son 2",
    price: 3000000,
  };

  const home3 = {
    location: "Katra",
    son: "Son 3",
    price: 4000000,
  };

  return (
    <div className="card father">
      <h1>👨 Father</h1>
      <p>Total Land: <span className="land">{land}</span></p>

      <Son1 land="5 Acres" home={home1} />
      <Son2 land="5 Acres" home={home2} />
    </div>
  );
};

export default Father;