import React from "react";
import { Document, Page } from 'react-pdf';

export default class TermsBody extends React.Component {

    state = {
        numPages: 10,
        pageNumber: 1,
      }
     
      onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
      }
     
      render() {
        const { pageNumber, numPages } = this.state;
 
        return (
          <div>
            <Document
              file={ require("../../pdf/Travas_ToS.pdf") }
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        );
      }
}