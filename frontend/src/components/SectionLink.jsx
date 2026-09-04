import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * One link type for nav and footer entries, which come in two shapes:
 * a section anchor on the landing page (`href: "#source"`) or a route
 * (`to: "/journal"`).
 *
 * Anchors stay a plain <a> while we are on the landing page, so SmoothScroll's
 * click interceptor still catches them and Lenis does the travel. From any
 * other route that same anchor has nothing to point at, so it becomes a router
 * Link to `/#source`  ScrollManager finishes the scroll once Landing has
 * mounted.
 */
const SectionLink = ({ href, to, children, ...rest }) => {
  const { pathname } = useLocation();

  if (to) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if (pathname === "/") {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={`/${href}`} {...rest}>
      {children}
    </Link>
  );
};

export default SectionLink;
