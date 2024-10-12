'use client'
// pages/index.tsx
import { useState } from 'react';
import MultiSelect from '../components/MultiSelect';

const Home: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Custom MultiSelect Example</h1>
      <MultiSelect
        options={options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Values:</h2>
        <ul className="list-disc ml-5 mt-2">
          {selectedOptions.map(option => (
            <li key={option.value}>{option.label}{option.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
