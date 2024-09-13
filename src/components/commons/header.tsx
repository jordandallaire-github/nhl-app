import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Svg } from "../utils/Icons";
import HeaderComponent from "../../components/header";

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
            <Link to="/">
              <Svg name="php" size="md"></Svg>
            </Link>
          </div>
          <nav className="nav-wrapper">
            <div className={`indicator-page-top ${currentPath.substring(1)}`}></div>
            <div className="nav-pill">
              <ul>
                <li>
                  <ActiveCustomLink to="/">
                    <div>Accueil</div>
                  </ActiveCustomLink>
                </li>
                <li>  
                  <ActiveCustomLink to="/equipes">
                    <div>équipes</div>
                  </ActiveCustomLink>
                </li>
                <li>  
                  <ActiveCustomLink to="/players">
                    <div>joueurs</div>
                  </ActiveCustomLink>
                </li>
              </ul>
              <div className={`indicator-pill ${currentPath.substring(1)}`}></div>
            </div>
          </nav>
          <button className="header__toggle js-toggle">
                <span></span>
                <span></span>
                <span></span>
          </button>
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
