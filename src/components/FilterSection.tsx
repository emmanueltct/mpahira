'use client';

import React from 'react';

interface FilterSectionProps {
  options: {
    id: string;
    title: string;
    options: string[];
    type: 'checkbox' | 'radio';
  }[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (id: string, values: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ options, selectedFilters, onFilterChange }) => {
  const handleChange = (filterId: string, value: string, type: string) => {
    const current = selectedFilters[filterId] || [];
    let updated: string[] = [];

    if (type === 'checkbox') {
      updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    } else {
      updated = [value]; // Only one selection for radio
    }

    onFilterChange(filterId, updated);
  };

  return (
    <aside className="space-y-6">
      {options.map((section) => (
        <div key={section.id}>
          <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
          <ul className="space-y-1">
            {section.options.map((option) => (
              <li key={option}>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type={section.type}
                    name={section.id}
                    value={option}
                    checked={selectedFilters[section.id]?.includes(option)}
                    onChange={() => handleChange(section.id, option, section.type)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default FilterSection;
