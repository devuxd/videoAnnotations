import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.annotation = React.createRef();
  }
  render() {
    return (
      <div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Recipient's username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            list="annotations"
            ref={this.annotation} 
          />
          <datalist id="annotations">
             <option value="Debugging" />
            <option value="Testing" />
            <option value="Coding" />
            <option value="Reading code" />
            <option value="Writing code" /> 
          </datalist>
            <div className="input-group-append" onClick={()=> Router.push(`/search/${this.annotation.current.value}`)}>
              <button className="btn btn-outline-secondary" type="submit">
                <FontAwesomeIcon icon={faSearch} /> &nbsp; Search
              </button>
            </div>
        </div>

        <div className="input-group mb-3">
          {/* <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">https://youtube.com/</span>
          </div> */}
          <input
            type="text"
            className="form-control"
            placeholder="Video Link"
            id="basic-url"
            aria-describedby="basic-addon3"
          />
        </div>

        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile02"
            />
            <label className="custom-file-label" for="inputGroupFile02">
              Annotations (JSON File)
            </label>
          </div>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" id="">
              <FontAwesomeIcon icon={faUpload} /> &nbsp; Upload
            </button>
          </div>
        </div>
        <div>
          <a href="/">Learn more about the JSON structure for annotations</a>
        </div>
      </div>
    );
  }
}
