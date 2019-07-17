import React from "react";
import Router from "next/router";
import VideoList from "../components/videoList.js";
import Layouts from "./layouts";
import Navigation from "../components/navigation.js";
import {collection, getDataset} from "../API/db";

export default class dataset extends React.Component {
  
  
  static async getInitialProps({ query }) {
    return { query };
  }

  constructor() {
    super();
    this.state = { annotations: [], query: null };
  }

  // This function fetch the data from google sheet
   async componentDidMount() {
     try{
    const payload = await getDataset(this.props.query.sheetId);
    console.dir(payload);
    // TODO: work to make the json structure look like the one we used before     
     // let localDataSet = payload.map( video =>{ */ do the mapping here */});
  } 
     catch (e){
       console.error (e);
     }
    let LocalAnnotations = this.searchForAnnotation(
      this.props.query.annotation
    );
    this.setState({
      annotations: LocalAnnotations,
      query: this.props.query.sheetId
    });
  }

  render() {
    return (
      <div style={{ fontFamily: "Lato" }}>
        <Layouts>
          <Navigation />
          <p style={{ paddingLeft: "5%" }}>
            You searched for : {this.state.query} dataset. <b>Look at the console for more info. each item in the array represent a video</b>
          </p>
          <br />
          <VideoList
            searchQuery={this.state.query}
            videoArray={this.state.annotations}
          />
          <br />
          <br />
          <br />
        </Layouts>
      </div>
    );
  }
  searchForAnnotation(annotation) {
    // Hard coded return values.
    return collection;
  }
}
