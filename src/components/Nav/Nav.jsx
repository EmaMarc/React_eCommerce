import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Nav = () => {

  useEffect(() => {
    console.log(`Nav mounted`)
  }, [])

  return (
    <div className="Nav-component">
      Test content
    </div>
  )
}

Nav.propTypes = {
  // bla: PropTypes.string,
};

Nav.defaultProps = {
  // bla: 'test',
};

export default Nav;
