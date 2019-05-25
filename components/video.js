import React from "react";

export default class video extends React.Component {
  static async getInitialProps({ query }) {
    console.log('SLUG', query.slug)
    return {}
  }
  render() {
    return (
      <div>
       <img
      style={{ width: "900px", display: "grid", margin: "auto" }}
      src="../static/show-annotation.jpg"
    />
   
      </div>
    );
  }
}


 
