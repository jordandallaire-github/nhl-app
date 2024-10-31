import { useCallback, useState, useEffect, FormEvent } from "react";
import { INTSearch } from "../interfaces/search";
import { SearchPage } from "../components/search-page";
import fetchTeamNames from "./teamName";
import debounce from "lodash/debounce";

const Search = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<INTSearch[]>([]);
  const [query, setQuery] = useState<string>("");
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({});
  const [teamColors, setTeamColors] = useState<Record<string, { color: string }>>({});

  const isBuildProduction = false;
  const path = isBuildProduction ? "/projets/dist/" : "/";
  const apiWeb = isBuildProduction
    ? "/proxy.php/"
    : "https://search.d3.nhle.com/";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [names, colorsResponse] = await Promise.all([
          fetchTeamNames(),
          fetch(`${path}teamColor.json`),
        ]);
        const colors = await colorsResponse.json();
        setTeamNames(names);
        setTeamColors(colors);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      }
    };
    loadData();
  }, [path]);

  const fetchSearch = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      setError(null);
      try {
        if (searchQuery.trim() !== "") {
          const response = await fetch(
            `${apiWeb}api/v1/search/player?culture=en-us&limit=20&q=${searchQuery}&active=true`
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la recherche.");
          }
          const searchData = await response.json();
          setSearchResults(Array.isArray(searchData) ? searchData : []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [apiWeb]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSearch = useCallback(
    debounce((searchQuery: string) => {
      fetchSearch(searchQuery);
    }, 300),
    [fetchSearch]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    debouncedFetchSearch.cancel();
    fetchSearch(query);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    debouncedFetchSearch(newQuery);
  };

  useEffect(() => {
    return () => {
      debouncedFetchSearch.cancel();
    };
  }, [debouncedFetchSearch]);

  return (
    <SearchPage
      onSubmit={handleSubmit}
      onQueryChange={handleQueryChange}
      query={query}
      loading={loading}
      error={error}
      searchResults={searchResults}
      teamName={teamNames}
      teamColor={teamColors}
    />
  );
};

export default Search;
