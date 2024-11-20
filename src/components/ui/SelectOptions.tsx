import { selectOptions } from '@/utils/constants';
import { X } from 'lucide-react';

const SelectOptions = () => {
  return (
    <>
      <div className="gi-select-bar d-flex">
        {selectOptions.map((item, index) => (
          <span className="gi-select-btn" key={index}>
            {item}
            <a className="gi-select-cancel" href="#">
              <X size={20} />
            </a>
          </span>
        ))}
        <span className="gi-select-btn gi-select-btn-clear">
          <a className="gi-select-clear" href="#">
            Clear All
          </a>
        </span>
      </div>
    </>
  );
};

export default SelectOptions;
