import { useState, useEffect, useRef, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  setSelectedOptions: (options: Option[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  const handleOptionClick = (option: Option) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    setSearchTerm(''); // Clear search term after selecting an option
    setIsOpen(true); // Keep dropdown open after selection
    setTimeout(() => inputRef.current?.focus(), 0); // Refocus input after selection
  };

  const handleRemoveOption = (option: Option) => {
    setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter') {
      if (filteredOptions[highlightedIndex]) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      }
    }
  };

  return (
    <div className="w-full max-w-sm relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Choose Options</label>
      <div
        className="border border-gray-300 rounded-md px-2 py-1 flex items-center flex-wrap space-x-2 cursor-pointer"
        onClick={handleToggleDropdown}
      >
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="bg-indigo-100 text-indigo-700 rounded-md px-2 py-1 text-xs flex items-center space-x-1"
          >
            {option.label}
            <button
              type="button"
              className="ml-1 text-indigo-500 hover:text-indigo-700"
              onClick={() => handleRemoveOption(option)}
            >
              &times;
            </button>
          </span>
        ))}

        <input
          type="text"
          ref={inputRef}
          className="flex-1 focus:outline-none bg-transparent"
          placeholder={selectedOptions.length === 0 ? 'Select...' : ''}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}  // Keep the dropdown open when input is focused
        />
      </div>

      {isOpen && (
        <ul className="absolute left-0 w-full border border-gray-300 mt-2 rounded-md max-h-40 overflow-y-auto bg-white shadow-lg z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`p-2 cursor-pointer flex items-center justify-between hover:bg-indigo-100 ${
                  selectedOptions.some((selected) => selected.value === option.value)
                    ? 'bg-indigo-50'
                    : ''
                } ${index === highlightedIndex ? 'bg-indigo-200' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <span>{option.label}</span>
                {selectedOptions.some((selected) => selected.value === option.value) && (
                  <span className="text-indigo-600 font-semibold">✔</span>  //{/* Unicode checkmark */}
                )}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
