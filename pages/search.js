import React from "react";
import collection from "../API/db";

export default class search extends React.Component {
  static async getInitialProps({ query }) {
    console.log(`You searched for ${query}`);
    return { query };
  }
  constructor() {
    super();
    this.state = { annotations: [] };
  }
  componentDidMount() {
    let LocalAnnotations = this.searchForAnnotation(
      this.props.query.annotation
    );
    this.setState({ annotations: LocalAnnotations });
  }
  render() {
    console.log(this.state.annotations);
    return (
      <div>
        You searched for : {JSON.stringify(this.props.query.annotation)}
        <br/>
        <br/>
        <br/>
        Annotations : {JSON.stringify(this.state.annotations)}

      </div>
    );
  }
  searchForAnnotation(annotation) {
    // Hard coded return values.
    return collection;
  }
}
