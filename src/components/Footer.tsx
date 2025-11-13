import { Link } from "react-router-dom";
import { APP_NAME } from "../config";

export const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div>
        <strong>{APP_NAME}</strong>
        <p>Bygd for studenter i Norge, Sverige og Danmark.</p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
          Betalinger er simulert i denne MVP-en. Vipps og kortbetaling kommer i neste
          versjon.
        </p>
      </div>
      <div className="footer__links">
        <Link to="/om">Om</Link>
        <Link to="/vilkar">Vilkår</Link>
        <Link to="/personvern">Personvern</Link>
        <Link to="/kontakt">Kontakt</Link>
      </div>
    </div>
  </footer>
);

