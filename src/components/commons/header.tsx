import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Svg } from "../../scripts/utils/Icons";
import HeaderComponent from "../utils/header";

export default function Header() {
  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <>
      <HeaderComponent></HeaderComponent>
      <header data-component="Header">
        <div className="header-content">
          <div className="logo">
            <Link aria-label="Logo JDH retour à l'accueil" to="/">
              <Svg name="jdh" size="md"></Svg>
            </Link>
          </div>
          <nav className="nav-wrapper header">
            <div
              className={`indicator-page-top ${
                currentPath.split("/")[1] !== ""
                  ? currentPath.split("/")[1]
                  : "accueil"
              }`}
            ></div>
            <div className="nav-pill">
              <ul>
                <li>
                  <ActiveCustomLink to="/">
                    <div>Accueil</div>
                  </ActiveCustomLink>
                </li>
                <li>
                  <ActiveCustomLink to="/equipes">
                    <div>Équipes</div>
                  </ActiveCustomLink>
                </li>
                <li>
                  <ActiveCustomLink to="/calendrier">
                    <div>Calendrier</div>
                  </ActiveCustomLink>
                </li>
                <li>
                  <ActiveCustomLink to="/classements">
                    <div>Classements</div>
                  </ActiveCustomLink>
                </li>
                <li>
                  <ActiveCustomLink to="/statistiques">
                    <div>Statistiques</div>
                  </ActiveCustomLink>
                </li>
                <li>
                  <ActiveCustomLink to="/joueurs-suivis">
                    <div>Mes joueurs</div>
                  </ActiveCustomLink>
                </li>
              </ul>
              <div
                className={`indicator-pill ${
                  currentPath.split("/")[1] !== ""
                    ? currentPath.split("/")[1]
                    : "accueil"
                }`}
              ></div>
            </div>
          </nav>
          <div className="mobile-nav">
            <Link aria-label="Bouton rechercher" to={"/recherche"} className="search">
                <Svg name="search" size="sm"></Svg>
            </Link>
            <button aria-label="Bouton Menu" className="header__toggle js-toggle">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        <div className="bg-menu-mobile"></div>
      </header>
    </>
  );
}

function ActiveCustomLink({
  to,
  children,
}: {
  to: string;
  children?: React.ReactNode;
}) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <Link className={isActive ? "active" : ""} to={to}>
      {children}
    </Link>
  );
}
