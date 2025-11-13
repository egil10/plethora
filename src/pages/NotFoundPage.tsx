import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export const NotFoundPage = () => (
  <div className="section">
    <div className="container card">
      <h1>Fant ikke siden</h1>
      <p>
        Ruten finnes ikke. Siden kan være under utvikling, eller du kan ha skrevet inn feil
        adresse.
      </p>
      <Link to="/">
        <Button>Til forsiden</Button>
      </Link>
    </div>
  </div>
);

