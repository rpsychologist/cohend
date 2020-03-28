import React from "react";
import { useStaticQuery, graphql } from "gatsby";

const AppVersion = () =>{
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            version
            github
            lastUpdated
          }
        }
      }
    `
  );
  return (
      <span>
    {data.site.siteMetadata.version}
      </span>
  );
};

export default AppVersion;
