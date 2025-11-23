interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedUniverse: string;
  setSelectedUniverse: (universe: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm, selectedUniverse, setSelectedUniverse }: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow">
      {/* Champ de recherche par nom */}
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Rechercher un héros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filtre par Univers */}
      <div className="min-w-[200px]">
        <select
          value={selectedUniverse}
          onChange={(e) => setSelectedUniverse(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Tous les univers</option>
          <option value="Marvel">Marvel Comics</option>
          <option value="DC">DC Comics</option>
          <option value="Autre">Autres</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;