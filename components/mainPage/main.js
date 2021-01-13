import React from "react";
import FileUpload from "./components/fileUpload";
import Image from "next/image";

function Main() {
  return (
    <div className="container" style={{ padding: "15%" }}>
      <div className="row">
        <div className="col-lrg">
          <div style={{ width: "30%", height: "30%", margin: "0px auto" }}>
            <a href="/">
              <Image
                width={1}
                height={1}
                layout={"responsive"}
                src="/observedevIcon.png"
              />
            </a>
          </div>
          <br />
          <br />
          <br />
          <br />
          <p>
            Upload your video dataset here! Enter your spreadsheet ID below to
            continue:
          </p>
          <FileUpload />
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1GBxfQqTuIwyj_ExmC_ct0wUxRqmoWjvfq8ibZsF2t60/edit?usp=sharing"
          >
            Want to create your own dataset? Use the following template to build
            a Google Sheet, share it publicly, and then insert the spreadsheet
            ID above.
          </a>
        </div>
      </div>
    </div>
  );
}
export default Main;
