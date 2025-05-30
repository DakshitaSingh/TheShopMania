// src/components/FilterSidebar.jsx
import React from 'react';

const FilterSidebar = ({ selectedFilters, setSelectedFilters, brands }) => {
  const handlePriceChange = (e, type) => {
    setSelectedFilters(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: Number(e.target.value),
      },
    }));
  };

  const handleBrandToggle = (brand) => {
    const newBrands = selectedFilters.brands || [];
    const updated = newBrands.includes(brand)
      ? newBrands.filter(b => b !== brand)
      : [...newBrands, brand];
    setSelectedFilters(prev => ({ ...prev, brands: updated }));
  };

  const clearAll = () => {
    setSelectedFilters({});
  };

  return (
    <aside className="w-full sm:w-64 p-4 border rounded-lg bg-white shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={clearAll} className="text-sm text-blue-600">
          Clear All
        </button>
      </div>

      {/* Price Filter */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min={0}
            value={selectedFilters.price?.min || 1000}
            onChange={(e) => handlePriceChange(e, 'min')}
            className="border rounded p-1 w-full"
            placeholder="Min"
          />
          <input
            type="number"
            min={0}
            value={selectedFilters.price?.max || 60000}
            onChange={(e) => handlePriceChange(e, 'max')}
            className="border rounded p-1 w-full"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Brand</h3>
        {brands.map((brand) => (
          <label key={brand} className="flex items-center mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.brands?.includes(brand) || false}
              onChange={() => handleBrandToggle(brand)}
            />
            <span className="ml-2">{brand}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
