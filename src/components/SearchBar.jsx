const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Search for shoes, clothes, makeup..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-xl px-4 py-2 border rounded shadow-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
