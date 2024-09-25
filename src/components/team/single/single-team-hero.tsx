interface TeamHeroProps {
  teamName: string | null;
  abr: string | null;
}

const SingleTeamHero: React.FC<TeamHeroProps> = ({ teamName, abr }) => {
  return (
    <section className="hero team">
      <div className="wrapper">
        <img
          className="hero-logo"
          src={`https://assets.nhle.com/logos/nhl/svg/${abr}_dark.svg`}
          alt={`${teamName} logo`}
        />
      </div>
    </section>
  );
};

export default SingleTeamHero;
