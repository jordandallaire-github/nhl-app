import { FormEvent, useRef, useEffect } from "react";
import { INTSearch } from "../interfaces/search";
import { Link } from "react-router-dom";

interface SearchPageProps {
  onSubmit: (e: FormEvent) => void;
  query: string;
  onQueryChange: (value: string) => void;
  loading?: boolean;
  error: string | null;
  searchResults: INTSearch[];
  teamName: { [key: string]: string };
  teamColor?: Record<string, { color: string }>;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSubmit,
  query,
  onQueryChange,
  loading,
  error,
  searchResults,
  teamName,
  teamColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wasLoadingRef = useRef(loading);

  useEffect(() => {
    if (wasLoadingRef.current && !loading) {
      inputRef.current?.focus();
    }
    wasLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const currentSelection = inputRef.current?.selectionStart || 0;
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(currentSelection, currentSelection);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart || 0;
    onQueryChange(e.target.value);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  };

  return (
    <section className="search-page hero">
      <div className="wrapper">
        <h1>Recherche</h1>
        <div className="searchbar">
          <form
            id="form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(e);
              inputRef.current?.focus();
            }}
          >
            <input
              ref={inputRef}
              type="search"
              id="query"
              name="q"
              value={query}
              onChange={handleInputChange}
              onBlur={(e) => {
                if (!e.relatedTarget) {
                  e.target.focus();
                }
              }}
              placeholder="Recherche"
              aria-label="Rechercher vos joueurs préférés!"
              disabled={loading}
              autoComplete="off"
              className="window window-effect"
            />
          </form>
          {searchResults.length === 0 && !query && (
            <p><strong>Rechercher vos joueurs préférés!</strong></p>
          )}
          {searchResults.length === 0 && query && !loading && (
            <p><strong>Aucun joueur trouvé pour {query}</strong></p>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Chargement...</div>}

        {searchResults.length > 0 && (
          <div className="search-results cards">
            {searchResults.map((player) => (
              <Link
                key={player.playerId}
                to={`/equipes/${
                  teamName[player.teamAbbrev]
                }/joueur/${player.name.toLowerCase().replace(/\s+/g, "-")}-${
                  player.playerId
                }`}
                className="card window-effect"
              >
                <div className="card-media player">
                  <img
                    src={`https://assets.nhle.com/mugs/nhl/20242025/${player.teamAbbrev}/${player.playerId}.png`}
                    alt={`${player.name}`}
                  />
                </div>
                <div className="card-content">
                  <h4>{player.name}</h4>
                  <div className="other-infos">
                    <p>
                      <strong>#{player.sweaterNumber}</strong>
                    </p>
                    <img
                      className="team-logo"
                      src={`https://assets.nhle.com/logos/nhl/svg/${player.teamAbbrev}_dark.svg`}
                    />
                    <p>
                      <strong>
                        {player.positionCode === "R"
                          ? "AD"
                          : player.positionCode === "L"
                          ? "AG"
                          : player.positionCode}
                      </strong>
                    </p>
                  </div>
                </div>
                <div
                  className="card-background-color"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${
                      teamColor?.[player.teamAbbrev].color
                    }, #0000)`,
                  }}
                ></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
