export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
      />
    </div>
  );
}