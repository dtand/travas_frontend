import React from "react"

/**
 * Main login component - renders login page
 */
export default class PageBreadcrumb extends React.Component {
  render() {
    return (
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="index.html">{ this.props.crumbTitle }</a>
        </li>
        <li className="breadcrumb-item active">{ this.props.crumbSubTitle }</li>
      </ol>
    );
  }
}
