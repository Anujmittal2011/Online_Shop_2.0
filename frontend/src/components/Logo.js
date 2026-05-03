import React from 'react';

const Logo = ({ w = 400, h = 400 }) => {
  return (
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGcHt01UuZ_8_TN1WXNI5D41ia8UzXn671xA&s"
      width={95}
      height={65}
      alt="Shop Logo"
      style={{
        borderRadius: '65px',
        // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        objectFit: 'cover',
      }}
    />
  );
};

export default Logo;
