import React from "react";
export default class video extends React.Component {
  render() {
    console.log(`Video id = ${this.props.url.query.id}`)
    return (
      <div>
       <img
      style={{ width: "900px", display: "grid", margin: "auto" }}
      src="./static/video.png"
    />
   
      </div>
    );
  }
}


 
