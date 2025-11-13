import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { APP_NAME } from "../config";
import { Button } from "./Button";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/", label: "Hjem" },
  { to: "/dokumenter", label: "Dokumenter" },
  { to: "/selger", label: "Selg" },
  { to: "/profil", label: "Profil" }
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          {APP_NAME}
        </Link>
        <nav className={cn("header__nav", menuOpen && "is-open")}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("header__link", isActive && "is-active")
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/selger" className="header__cta" onClick={() => setMenuOpen(false)}>
            <Button size="md">Publiser notater</Button>
          </Link>
        </nav>
        <button
          className="header__toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Åpne meny"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

