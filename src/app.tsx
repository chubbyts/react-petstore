import type { FC } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Routes from './routes';

const App: FC = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  const toggleMenu = () => {
    setDisplayMenu(!displayMenu);
  };

  return (
    <div className="relative flex min-h-full flex-col md:flex-row">
      <nav className="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl font-semibold uppercase leading-relaxed text-gray-100">
        <button
          className="float-right block border-2 p-2 md:hidden"
          data-testid="navigation-toggle"
          onClick={toggleMenu}
        >
          <span className="block h-2 w-6 border-t-2" />
          <span className="block h-2 w-6 border-t-2" />
          <span className="block h-0 w-6 border-t-2" />
        </button>
        <NavLink className="hover:text-gray-500" to="/">
          Petstore
        </NavLink>
      </nav>
      <nav
        className={`mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 ${displayMenu ? 'block' : 'hidden'}`}
      >
        <ul>
          <li>
            <NavLink
              data-testid="navigation-pet"
              className={({ isActive }) =>
                `block px-4 py-2 ${
                  isActive
                    ? 'text-gray-100 bg-gray-700 hover:bg-gray-600'
                    : 'text-gray-900 bg-gray-300 hover:bg-gray-400'
                }`
              }
              to="/pet"
            >
              Pets
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={`w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 ${displayMenu ? 'mt-0' : 'mt-16'}`}>
        <Routes />
      </div>
    </div>
  );
};

export default App;
