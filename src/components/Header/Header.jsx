import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Header = () => {

  useEffect(() => {
    console.log(`Header mounted`)
  }, [])

  return (
    <div className="Header-component">
      Test content
    </div>
  )
}

Header.propTypes = {
  // bla: PropTypes.string,
};

Header.defaultProps = {
  // bla: 'test',
};

export default Header;
