// ShopTop.tsx
import { Filter, LayoutGrid, List } from 'lucide-react';
import React, { useState } from 'react';

const ShopTop: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const handleViewChange = (view: 'grid' | 'list') => {
    setActiveView(view);
  };

  return (
    <>
      <div className="gi-pro-list-top d-flex">
        <div className="col-md-6 gi-grid-list">
          <div className="gi-gl-btn">
            <button
              className="grid-btn filter-toggle-icon"
              aria-label="Toggle filter"
            >
              <Filter size={23} strokeWidth={2} color="#4b5966" />
            </button>
            <button
              className={`grid-btn btn-grid-50 ${
                activeView === 'grid' ? 'active' : ''
              }`}
              aria-label="Grid view"
              onClick={() => handleViewChange('grid')}
            >
              <LayoutGrid
                size={23}
                strokeWidth={2}
                color={activeView === 'grid' ? 'white' : '#4b5966'}
              />
            </button>
            <button
              className={`grid-btn btn-list-50 ${
                activeView === 'list' ? 'active' : ''
              }`}
              aria-label="List view"
              onClick={() => handleViewChange('list')}
            >
              <List
                size={23}
                strokeWidth={2}
                color={activeView === 'list' ? 'white' : '#4b5966'}
              />
            </button>
          </div>
        </div>
        <div className="col-md-6 gi-sort-select">
          <div className="gi-select-inner">
            <select
              name="gi-select"
              id="gi-select"
              defaultValue=""
              aria-label="Sort options"
            >
              <option value="" disabled>
                Sort by
              </option>
              <option value="1">Position</option>
              <option value="2">Relevance</option>
              <option value="3">Name, A to Z</option>
              <option value="4">Name, Z to A</option>
              <option value="5">Price, low to high</option>
              <option value="6">Price, high to low</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopTop;
