import { useEffect, useState } from "react";
import { TeamDetail } from "../../interfaces/team/teamDetails";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Footer from "../commons/footer";
import Header from "../commons/header";

function Layout() {
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const location = useLocation();
  const { teamCommonName } = useParams<{ teamCommonName?: string }>();

  const isBuildProduction = false
  const path = isBuildProduction ? "/projets/jdh/" : "/";
  const apiWeb = isBuildProduction ? "/proxy.php/" : "https://api-web.nhle.com/"

  useEffect(() => {
    const fetchTeamColor = async () => {
      if (teamCommonName) {
        try {
          const res = await fetch(`${apiWeb}v1/standings/now`);
          if (!res.ok) throw new Error("Failed to fetch team data");
          const data = await res.json();
          const team = data.standings?.find(
            (t: TeamDetail) =>
              t.teamCommonName.default.toLowerCase().replace(/\s+/g, "-") ===
              teamCommonName
          );

          if (team) {
            const teamAbbrev = team.teamAbbrev.default;
            const colorRes = await fetch(`${path}teamColor.json`);
            if (!colorRes.ok) throw new Error("Failed to fetch team colors");
            const colorData: Record<string, { color: string }> =
              await colorRes.json();
            const teamInfo = colorData[teamAbbrev as keyof typeof colorData];
            if (teamInfo) {
              setTeamColor(teamInfo.color);
            }
          }
        } catch (error) {
          console.error("Error fetching team color:", error);
        }
      } else {
        setTeamColor(null);
      }
    };

    fetchTeamColor();
  }, [apiWeb, path, teamCommonName]);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    const navPill = document.querySelector(".indicator-page-top");

    const applyBackground = () => {
      if (
        location.pathname.startsWith(`/equipes/${teamCommonName}`) &&
        teamColor &&
        mainElement
      ) {
        const rgb = parseInt(teamColor.slice(1), 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = rgb & 255;

        if (navPill) {
          (navPill as HTMLDivElement).style.backgroundColor = `${teamColor}`;
          (
            navPill as HTMLDivElement
          ).style.boxShadow = `0 2px 25px 2px ${teamColor}`;
        }

        const calculateBackgroundPercentage = () => {
          const screenWidth = window.innerWidth;
          if (screenWidth < 768) {
            return Math.max(Math.min((screenWidth / 768) * 100, 200), 170);
          } else {
            return Math.max(Math.min((screenWidth / 1920) * 100, 80), 90);
          }
        };

        mainElement.style.backgroundImage = `radial-gradient(circle closest-corner at 50% 0, rgba(${r}, ${g}, ${b}, 0.6) 0%, #0000 ${calculateBackgroundPercentage()}%)`;
      } else {
        if (mainElement) {
          mainElement.style.backgroundImage = "";
        }
        if (navPill) {
          (navPill as HTMLDivElement).style.backgroundColor = "";
          (navPill as HTMLDivElement).style.boxShadow = "";
        }
      }
    };

    applyBackground();

    window.addEventListener("resize", applyBackground);
    return () => {
      window.removeEventListener("resize", applyBackground);
    };
  }, [location.pathname, teamColor, teamCommonName]);

  useEffect(() => {
    if (document.documentElement.style.overflow === "hidden")
      document.documentElement.style.overflow = "auto";
  }, [location]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
