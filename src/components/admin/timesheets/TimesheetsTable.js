import React, { Component } from "react";
import "./admin-timesheets.css";
import "../../../css/Employees.css";
import * as Constants from "../../Constant";
import moment from "moment";
import { css, StyleSheet } from "aphrodite/no-important";
import ImgsViewer from "react-images-viewer";
class TimesheetsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      timesheetIds: [],
      selectedStatus: "",
      displayImages: [],
      viewerIsOpen: false,
      currImg: 0,
      images: [],
      selectAll: false,
    };
  }
  displayImages = (images, event) => {
    event.preventDefault();

    const imagesSet = [];

    images.forEach((image) => {
      imagesSet.push({
        src: image.startsWith("http") ? image : `${Constants.AWS_URL}${image}`,
      });
    });

    this.setState({
      displayImages: imagesSet,
      viewerIsOpen: true,
    });
  };

  gotoPrev = () => {
    this.setState({
      currImg: this.state.currImg - 1,
    });
  };

  gotoNext = () => {
    this.setState({
      currImg: this.state.currImg + 1,
    });
  };

  gotoImg = (index) => {
    this.setState({
      currImg: index,
    });
  };

  openImgsViewer = (index, event) => {
    event.preventDefault();
    this.setState({
      currImg: index,
      viewerIsOpen: true,
    });
  };
  closeImgsViewer = () => {
    this.setState({
      currImg: 0,
      displayImages: [],
      viewerIsOpen: false,
    });
  };

  handleClickImg = () => {
    if (this.state.currImg === this.displayImages.length - 1) return;
    this.gotoNext();
  };

  renderGallery = () => {
    if (!this.state.displayImages) return;

    const gallery = this.state.displayImages
      .filter((i) => i.useForDemo)
      .map((obj, i) => {
        return (
          <a
            href={obj.src}
            className={css(classes.thumbnail, classes[obj.orientation])}
            key={i}
            onClick={(e) => this.openImgsViewer(i, e)}
          >
            <img src={obj.thumbnail} className={css(classes.source)} alt="" />
          </a>
        );
      });

    return <div className={css(classes.gallery)}>{gallery}</div>;
  };
  addOrRemoveTimesheets(event) {
    var name = event.target.name;
    var isChecked = event.target.checked;
    var timesheetData = this.props.timesheetData;
    var keys = Object.keys(timesheetData);
    console.log(timesheetData);
    var timesheetIds = this.state.timesheetIds;
    if (!name.includes("cust") && name.includes("table")) {
      var index = name.split("_")[1];
      var details = timesheetData[keys[index]].value;
      var custIds = Object.keys(details);
      custIds.forEach((id) => {
        var list = details[id].value;
        list.forEach((listId) => {
          if (isChecked) {
            timesheetIds.push(listId["_id"]);
            document.getElementsByName(listId["_id"])[0].checked = true;
          } else if (timesheetIds.indexOf(listId["_id"]) !== -1) {
            timesheetIds.splice(timesheetIds.indexOf(listId["_id"]), 1);
            document.getElementsByName(listId["_id"])[0].checked = false;
          }
        });
      });
      document
        .querySelectorAll("[name^=table_" + index + "]")
        .forEach((ele) => (ele.checked = isChecked));
    } else if (name.includes("cust") && name.includes("table")) {
      var splitString = name.split("_");
      var tableIndex = splitString[1];
      var cust_index = splitString[3];
      var details = timesheetData[keys[tableIndex]].value;
      var custIds = Object.keys(details);
      var lst = details[custIds[cust_index]].value;
      lst.forEach((l) => {
        if (isChecked) {
          timesheetIds.push(l["_id"]);
          document.getElementsByName(l["_id"])[0].checked = true;
        } else {
          if (timesheetIds.indexOf(l["_id"]) !== -1) {
            timesheetIds.splice(timesheetIds.indexOf(l["_id"]), 1);
            document.getElementsByName(l["_id"])[0].checked = false;
          }
        }
      });
      if (!isChecked)
        document.getElementsByName("table_" + tableIndex)[0].checked = false;
    } else {
      if (isChecked) timesheetIds.push(name);
      else
        timesheetIds.indexOf(name) !== -1
          ? timesheetIds.splice(timesheetIds.indexOf(name), 1)
          : (timesheetIds = timesheetIds);
    }
    if (document.getElementById("selectAll"))
      document.getElementById("selectAll").checked = false;
    this.setState({ timesheetIds: timesheetIds });
    this.props.setTimesheetIds(timesheetIds);
  }
  selectAll(event) {
    var timesheetData = this.props.timesheetData;
    var checked = event.target.checked;
    var timesheetIds = [];
    var keys = Object.keys(timesheetData);
    keys.forEach((key, index) => {
      var details = timesheetData[key].value;
      var custIds = Object.keys(details);
      custIds.forEach((id) => {
        var list = details[id].value;
        list.forEach((listId) => {
          if (checked) {
            timesheetIds.push(listId["_id"]);
            document.getElementsByName(listId["_id"])[0].checked = true;
          } else if (timesheetIds.indexOf(listId["_id"]) !== -1) {
            timesheetIds.splice(timesheetIds.indexOf(listId["_id"]), 1);
            document.getElementsByName(listId["_id"])[0].checked = false;
          }
        });
      });
    });
    this.setState({ timesheetIds: timesheetIds });
    this.props.setTimesheetIds(timesheetIds);
    document
      .querySelectorAll("[name^=table_]")
      .forEach((ele) => (ele.checked = checked));
  }
  constructMainTable() {
    var content = [];
    var keys = this.props.timesheetData
      ? Object.keys(this.props.timesheetData)
      : [];
    console.log("Error")
    // console.log(this.props.timesheetData[keys[0]]);
    var temp = this.props.timesheetData[0];
    temp = JSON.stringify(temp);
    // temp = JSON.parse(temp);
    console.log(temp);
    console.log(keys.length);
    for (var i = 0; i < keys.length; i++) {
      content.push(
        <table className="table align-items-center table-flush mt-2">
          <thead className="thead-dark">
            <tr>
              <th scope="col" colspan="3">
                <div className="col-lg-6">
                  <div className="form-group mt-4">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id={"table_" + i}
                        type="checkbox"
                        name={"table_" + i}
                        onChange={(event) => this.addOrRemoveTimesheets(event)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={"table_" + i}
                      >
                        {this.props.timesheetData[keys[i]].key}
                      </label>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="list">
          {/* {this.getCustomerTable(this.props.timesheetData[keys[i]].value, i)} */}
            {this.getCustomerTable(this.props.timesheetData[keys[i]], i)}
          </tbody>
        </table>
      );
    }
    return content;
  }
  getCustomerTable(tesDetails, index) {
    var content = [];
    console.log('test');
    console.log(index);
    var keys = Object.keys(tesDetails);
    console.log(keys.length);
    // var keys = 5;
    for (var i = 0; i < keys.length; i++) {
      content.push(
        <React.Fragment>
          <tr className="thead-light">
            <th scope="row" colspan="3">
              <div className="container withoutMargin">
                <div className="row">
                  <div className="col-8">
                    <div className="form-group mt-4">
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id={"table_" + index + "_cust_" + i}
                          type="checkbox"
                          name={"table_" + index + "_cust_" + i}
                          onChange={(event) =>
                            this.addOrRemoveTimesheets(event)
                          }
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={"table_" + index + "_cust_" + i}
                        >
                          {tesDetails[keys[i]].key}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="form-group mt-4">
                      <span
                        name={"table" + index + "_cust" + index}
                        onClick={(event) => this.showContent(event)}
                        className="accordion"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <p
                name={"table" + index + "_cust" + index}
                onClick={(event) => this.showContent(event)}
              >
                {tesDetails[keys[i]].key}
              </p> */}
            </th>
          </tr>
          <tr className="removeContent" id={"table" + index + "_cust" + index}>
            <table>
              <tbody>
                {/* {this.buildTimesheetDetails(tesDetails[keys[i]].value)} */}
                {this.buildTimesheetDetails(tesDetails)} 
              </tbody>
            </table>
          </tr>
        </React.Fragment>
      );
    }
    return content;
  }
  buildTimesheetDetails(custDetails) {
    var content = [];
    // for (var i = 0; i < custDetails.length; i++) {
    console.log("custDetails");
    console.log(custDetails);
    var tesData = custDetails;

    // content = custDetails.map((tesData, index) => {
      return (
        <React.Fragment>
          {() => this.renderGallery()}
          <ImgsViewer
            backdropCloseable
            currImg={this.state.currImg}
            imgs={this.state.displayImages}
            isOpen={this.state.viewerIsOpen}
            onClickImg={this.handleClickImg}
            onClickNext={this.gotoNext}
            onClickPrev={this.gotoPrev}
            onClickThumbnail={this.gotoImg}
            onClose={this.closeImgsViewer}
            showThumbnails={true}
          />
          <tr>
            <td>
              <div className="form-group mt-4">
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id={tesData["_id"]}
                    type="checkbox"
                    name={tesData["_id"]}
                    onChange={(event) => this.addOrRemoveTimesheets(event)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={tesData["_id"]}
                  ></label>
                </div>
              </div>
            </td>
            <td>
              <div>
                <span>Start Time</span>
                <p>{moment(tesData["StartTime"]).format("Do MMM dddd YYYY")}</p>
              </div>
              <div>
                <span>Client</span>
                {/* <p>{tesData["client"][0].DisplayName}</p> */}
              </div>
              {tesData["Description"] ? (
                <div>
                  <span>Description</span>
                  <p>{tesData["Description"]}</p>
                </div>
              ) : (
                ""
              )}
              <div>
                <span>Variation</span>
                <p>{tesData["BillableStatus"]}</p>
              </div>
              {tesData["notes"] ? (
                <div>
                  <span>Variation Notes</span>
                  <p>{tesData["notes"]}</p>
                </div>
              ) : (
                ""
              )}
              {tesData["images"] && tesData["images"].length ? (
                <div>
                  <span>Attachements</span>
                  <div
                    class="avatar-group"
                    onClick={(event) =>
                      this.displayImages(tesData["images"], event)
                    }
                  >
                    {tesData["images"].length > 0
                      ? tesData["images"].map((image, imageIndex) => (
                          <a
                            href="/"
                            class="avatar avatar-sm"
                            key={imageIndex}
                            data-toggle="tooltip"
                            data-original-title="Ryan Tompson"
                          >
                            <img
                              alt=""
                              src={
                                image.startsWith("http")
                                  ? image
                                  : `${Constants.AWS_URL}${image}`
                              }
                              class="rounded-circle"
                            />
                          </a>
                        ))
                      : "N/A"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </td>
            <td>
              <span>Hours</span>
              <p>{tesData["Hours"]}</p>
            </td>
          </tr>
        </React.Fragment>
      );
    
    //content.push();
    //}
    // return content;
  }
  showContent(event) {
    document
      .getElementById(event.target.getAttribute("name"))
      .classList.toggle("removeContent");
    var element = event.target;
    element.classList.toggle("active");
  }
  componentDidMount() {
    this.setState({ timesheetIds: [] });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedStatus !== this.state.selectedStatus) {
      this.setState({ timesheetIds: [] });
      var inputs = document.querySelectorAll("input[type='checkbox']");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedStatus !== prevState.selectedStatus) {
      return {
        selectedStatus: nextProps.selectedStatus,
      };
    }
    return null;
  }
  render() {
    console.log("props", this.props.selectedStatus);
    console.log(this.props);
    return (
      <React.Fragment>
        {this.props.timesheetData ? (
          <div>
            <div className="form-group mt-4">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="selectAll"
                  type="checkbox"
                  name={this.state.selectAll}
                  onChange={(event) => this.selectAll(event)}
                />
                <label className="custom-control-label" htmlFor="selectAll">
                  Select All
                </label>
              </div>
            </div>
            <div className="table-responsive">{this.constructMainTable()}</div>
          </div>
        ) : (
          <p>No Timesheet details available!</p>
        )}
      </React.Fragment>
    );
  }
}

const gutter = {
  small: 2,
  large: 4,
};

const classes = StyleSheet.create({
  gallery: {
    marginRight: -gutter.small,
    overflow: "hidden",
    "@media (min-width: 500px)": {
      marginRight: -gutter.large,
    },
  },

  // anchor
  thumbnail: {
    boxSizing: "border-box",
    display: "block",
    float: "left",
    lineHeight: 0,
    paddingRight: gutter.small,
    paddingBottom: gutter.small,
    overflow: "hidden",

    "@media (min-width: 500px)": {
      paddingRight: gutter.large,
      paddingBottom: gutter.large,
    },
  },

  // orientation
  landscape: {
    width: "30%",
  },
  square: {
    paddingBottom: gutter.large,
    width: "40%",

    "@media (min-width: 500px)": {
      paddingBottom: gutter.large,
    },
  },

  // actual <img />
  source: {
    border: 0,
    display: "block",
    height: "auto",
    maxWidth: "100%",
    width: "auto",
  },
});
export default TimesheetsTable;

