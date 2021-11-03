import React, { Component } from "react";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <footer className="footer">
        <div className="row align-items-center justify-content-md-between">
          <div className="col-md-6">
            <div className="copyright">
              &copy; 2019 &nbsp;
                <a href="/" target="_blank">
                Verd
                </a>
              .
              </div>
          </div>
          <div className="col-md-6">
            <ul className="nav nav-footer justify-content-end">
              <li className="nav-item">
                <a href="/" className="nav-link" target="_blank">
                  Verd
                  </a>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link" target="_blank">
                  About Us
                  </a>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link" target="_blank">
                  License
                  </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
