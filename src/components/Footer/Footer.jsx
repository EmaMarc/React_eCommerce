import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Footer = () => {

  useEffect(() => {
    console.log(`Footer mounted`)
  }, [])

  return (
    <div className="Footer-component">
      Test content
    </div>
  )
}

Footer.propTypes = {
  // bla: PropTypes.string,
};

Footer.defaultProps = {
  // bla: 'test',
};

export default Footer;
