import { useCallback, useState, useEffect, FormEvent, useRef } from "react";
import { INTSearch } from "../interfaces/search";
import { SearchPage } from "../components/search-page";
import fetchTeamNames from "./teamName";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<INTSearch[]>([]);
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({});
  const [teamColors, setTeamColors] = useState<Record<string, { color: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const searchInProgress = useRef(false);

  const isBuildProduction = true;
  const path = isBuildProduction ? "/projets/dist/" : "/";
  const apiWeb = isBuildProduction
    ? "/proxy.php/"
    : "https://search.d3.nhle.com/";

  const fetchSearch = useCallback(
    async (searchQuery: string) => {
      if (searchInProgress.current) return;
      
      searchInProgress.current = true;
      setIsLoading(true);
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
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        );
        setSearchResults([]);
      } finally {
        searchInProgress.current = false;
        setIsLoading(false);
      }
    },
    [apiWeb]
  );

  const debouncedFetchSearch = useCallback(
    debounce((searchQuery: string) => {
      fetchSearch(searchQuery);
    }, 300),
    [fetchSearch]
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
        setError("Erreur lors du chargement des données initiales.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [path]);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery && teamNames && Object.keys(teamNames).length > 0) {
      fetchSearch(initialQuery);
    }
  }, [searchParams, teamNames, fetchSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    debouncedFetchSearch.cancel();
    fetchSearch(query);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim() !== "") {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
    
    if (!searchInProgress.current) {
      debouncedFetchSearch(newQuery);
    }
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
      loading={isLoading}
      error={error}
      searchResults={searchResults}
      teamName={teamNames}
      teamColor={teamColors}
    />
  );
};

export default Search;