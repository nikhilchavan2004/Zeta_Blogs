import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div className={theme}>
      <div className='bg-white text-gray-800 dark:text-gray-200 dark:bg-[rgb(0,0,0)] dark:[rgb(100,20,20)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}

// Add PropTypes validation
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};