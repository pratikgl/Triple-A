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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              Recent Account IDs
            </div>
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 text-gray-700 transition-all duration-150 flex items-center gap-2 group border-b border-gray-100 last:border-b-0"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
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
                <span className="font-medium text-gray-900 group-hover:text-blue-700">
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

