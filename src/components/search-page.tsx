import { FormEvent, useRef } from "react";
import { INTSearch } from "../interfaces/search";
import { useFollowSystem } from "../scripts/followSystem";
import { renderPlayerCard } from "../scripts/renderFollowPlayers";

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
  const { followedPlayers } = useFollowSystem();

  const renderResults = () => {
    if (searchResults.length > 0) {
      return (
        <div className="search-results cards">
          {searchResults.map(player => renderPlayerCard(player, teamName, teamColor))}
        </div>
      );
    }

    if (!query && followedPlayers.length > 0) {
      return (
        <>
          <h2>Joueurs suivis:</h2>
          <div className="search-results cards">
            {followedPlayers.map(player => renderPlayerCard(player, teamName, teamColor))}
          </div>
        </>
      );
    }

    if (!query) {
      return (
        <p>
          <strong>Rechercher vos joueurs préférés!</strong>
        </p>
      );
    }

    if (!loading) {
      return (
        <p>
          <strong>Aucun joueur trouvé pour {query}</strong>
        </p>
      );
    }

    return null;
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
            }}
          >
            <input
              ref={inputRef}
              type="search"
              id="query"
              name="q"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Recherche"
              aria-label="Rechercher vos joueurs préférés!"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              className="window window-effect"
            />
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {renderResults()}
      </div>
    </section>
  );
};