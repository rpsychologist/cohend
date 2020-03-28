import React from "react";
import { useStaticQuery, graphql } from "gatsby";

const AppVersion = () => {
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
  const date = new Date(data.site.siteMetadata.lastUpdated);
  const year = date.getFullYear();
  const version = data.site.siteMetadata.version;
  return (
    <span>
      {`
@software{magnussonCohend,
    author = {Kristoffer Magnusson},
    title = {Interpreting Cohen's d Effect Size: An Interactive Visualization},
    url = {https://rpsychologist.com/d3/cohend/},
    version = {${version}},
    date = {${year}},
  }
 `}
    </span>
  );
};

export default AppVersion;
