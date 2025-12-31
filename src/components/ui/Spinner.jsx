import React from "react";
import PropTypes from "prop-types";

const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div
        className={`animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-blue-500`}
      ></div>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Spinner;
