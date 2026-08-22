import useSearchStore from "../../../store/searchStore";

function SearchInputs() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  return (
    <input
      type="text"
      placeholder="Search tasks"
      className="search-input"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default SearchInputs;
