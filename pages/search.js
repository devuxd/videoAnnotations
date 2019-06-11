import React from "react";

export default class search extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You searched for ${query}`)
    return {query}
  }
  render() {
    return (
      <div>
     You searched for : {JSON.stringify(this.props.query.annotation)}
   
      </div>
    );
  }
}


 
