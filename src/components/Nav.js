import React, { Component } from "react";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.getItem("name")
    };
  }

  handleLogout = event => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    this.props.setLogout();
  };

  render() {
    return (
      <nav
        className="navbar navbar-top navbar-expand-md navbar-dark"
        id="navbar-main"
      >
        <div className="container-fluid">
          <a
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            href="/"
          >
            {this.props.title}
          </a>

          <ul className="navbar-nav align-items-center d-none d-md-flex">
            <li className="nav-item dropdown">
              <a
                className="nav-link pr-0"
                href="/"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="media align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img src="../assets/img/theme/team-4-800x800.jpg" alt="" />
                  </span>
                  <div className="media-body ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm  font-weight-bold">
                      {this.state.name}
                    </span>
                  </div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
                <div className=" dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </div>
                <a href="/" className="dropdown-item">
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </a>
                <div className="dropdown-divider" />
                <a
                  href="/"
                  className="dropdown-item"
                  onClick={event => {
                    this.handleLogout(event);
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Nav;

// export default withRouter(Nav);
