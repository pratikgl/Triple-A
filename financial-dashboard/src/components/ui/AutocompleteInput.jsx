import { useState, useEffect, useRef } from 'react';
import { Input } from './Input';

export function AutocompleteInput({
  id,
  value,
  onChange,
  suggestions = [],
  placeholder,
  disabled,
  ...props
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Filter suggestions based on input value
    if (value && suggestions.length > 0) {
      const filtered = suggestions
        .filter((suggestion) =>
          suggestion.toString().toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Show max 5 suggestions
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions.slice(0, 5));
    }
  }, [value, suggestions]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e);
    if (!showSuggestions) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion.toString() } });
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        {...props}
      />

      {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 max-h-64 overflow-hidden animate-slide-down backdrop-blur-sm">
          <div className="overflow-y-auto max-h-64">
            <div className="sticky top-0 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-b-2 border-gray-100 backdrop-blur-sm">
              Recent Account IDs
            </div>
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 flex items-center gap-3 group border-b border-gray-50 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-[1.02] hover:shadow-sm"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Account #{suggestion}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

