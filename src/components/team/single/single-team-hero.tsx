interface TeamHeroProps {
  teamName: string | null;
  abr: string | null;
  wins: number | null;
  loss: number | null;
  otLoss: number | null;
  conference: number | null;
  league: number | null;
  division: number | null;
}

const SingleTeamHero: React.FC<TeamHeroProps> = ({
  teamName,
  abr,
  wins,
  loss,
  otLoss,
  league,
  division,
  conference
}) => {
  return (
    <section className="hero team">
      <div className="wrapper">
        <img
          className="hero-logo"
          src={`https://assets.nhle.com/logos/nhl/svg/${abr}_dark.svg`}
          alt={`${teamName} logo`}
          loading="lazy"
        />
        <div className="team-standing window-effect">
          <div className="ranking">
            <p>Ligue</p>
            <p><strong>{league === 1 ? 1 + "er" : league + "e"}</strong></p>
          </div>
          <div className="ranking">
            <p>Conférence</p>
            <p><strong>{conference === 1 ? 1 + "er" : conference + "e"}</strong></p>
          </div>
          <div className="ranking">
            <p>Division</p>
            <p><strong>{division === 1 ? 1 + "er" : division + "e"}</strong></p>
          </div>
          <div className="ranking">
            <p>Fiche</p>
            <p>
              <strong>
                {wins}-{loss}-{otLoss}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleTeamHero;
