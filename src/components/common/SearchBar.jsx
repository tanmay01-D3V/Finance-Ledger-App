import { FiSearch } from "react-icons/fi";

const SearchBar = ({
  placeholder = "Search..."
}) => {
  return (
    <div className="relative w-full max-w-xl">
      <FiSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
      />

      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full
          pl-12
          pr-4
          py-3
          border
          rounded-xl
          bg-white
          outline-none
          focus:ring-2
          focus:ring-black
        "
      />
    </div>
  );
};

export default SearchBar;