import React, { Component } from "react";
import Icon from "@mdi/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mdiPlus, mdiDotsVertical, mdiCalendar, mdiDelete } from "@mdi/js";
import axios from "axios";
import "../css/Employees.css";
import * as Constants from "./Constant";
import Moment from "moment";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";
import ImgsViewer from "react-images-viewer";
import { parseJwt, getToken, httpClient } from "../UtilService";
import PropTypes from "prop-types";
import { css, StyleSheet } from "aphrodite/no-important";
import CameraInput from "../shared/inputs/Camera";
import fscreen from "fscreen";

const $ = window.$;

class MyTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StartTime: new Date(),
      Hours: "",
      taskId: "",
      isBillable: false,
      Description: "",
      notes: "",
      tasks: [],
      classes: [],
      clients: [],
      timesheets: [],
      totalCount: 0,
      isLoading: true,
      displayImages: [],
      viewerIsOpen: false,
      currImg: 0,
      images: [],
      displayCamera: false,
      uploadPreviewOpen: false,
      uploadImageIndex: 0,
      empData: {},
      clientTasks: {},
      taskDropdown: [],
      clientList: [],
    };
  }

  componentDidMount() {
    this.getMyTimeSheets();
    this.getClients();
    this.getService();
  }
  getService = () => {
    var url = Constants.BASE_URL + "task/list";
    var self = this;
    var payload = {
      token: localStorage.getItem("token"),
    };
    axios
      .post(url,payload)
      .then(function(response){
        if(response.data.success){
          console.log(response.data.data);
          self.setState({taskList:response.data.data});
        }
      })
      .catch(function(error){
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }
  getClients = () => {
    // this.setState({
    //   clientId: "demo", 
    // });
    var self = this;

    var payload = {
      token: localStorage.getItem("token"),
    };

    var url = Constants.BASE_URL + "client/list";
    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          self.setState({
            clientList: response.data.data,
          });
        }
      })
      .catch(function (error) {
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
  };
  getMyTimeSheets = () => {
    Moment.locale("en");

    var self = this;

    var payload = {
      token: localStorage.getItem("token"),
    };

    var url = Constants.BASE_URL + "timesheet/listWithCount";

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          self.setState({
            timesheets: response.data.data,
            isLoading: false,
            totalCount: Math.ceil(response.data.totalCount / 10),
          });
        }
      })
      .catch(function (error) {
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
      
    //url = Constants.BASE_URL + "employee/categories";
    url = Constants.BASE_URL + "employee/getEmployeeDetails";

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          self.setState({
            clients: response.data.clients,
            //classes: response.data.classes,
            clientTasks: response.data.clientTasks,
            empData: response.data.empData,
            tasks: response.data.tasks,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  toggleChange = (event) => {
    this.setState({ isBillable: !this.state.isBillable });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleDateChange = (StartTime) => {
    this.setState({
      StartTime: StartTime,
    });
  };

  handleFileChange = (event) => {
    if (this.state.images && this.state.images.length) {
      var images = Array.from(this.state.images);
      images.push(...event.target.files);
      this.setState({ images: images });
    } else
      this.setState({
        images: event.target.files || [],
      });
  };

  handleClientChange = (event) => {
    // if (this.state.clientTasks) {
    //   var tasks = this.state.clientTasks[event.target.value];
    //   if (tasks && tasks.length) {
    //     this.setState({
    //       taskDropdown: this.state.tasks.filter(
    //         (task) => tasks.indexOf(task["Id"]) != -1
    //       ),
    //     });
    //   }
    // }
    this.setState({ clientId: event.target.value });

    this.setState({value: event.target.value});

    // this.setState({ clientId: "demo" });
  };
  handleTaskChange = (event) => {
    // if (this.state.clientTasks) {
    //   var tasks = this.state.clientTasks[event.target.value];
    //   if (tasks && tasks.length) {
    //     this.setState({
    //       taskDropdown: this.state.tasks.filter(
    //         (task) => tasks.indexOf(task["Id"]) != -1
    //       ),
    //     });
    //   }
    // }
    this.setState({ taskId: event.target.value });

    this.setState({selectValue: event.target.value});

    // this.setState({ clientId: "demo" });
  };
  handleSubmit = (event) => {
    event.preventDefault();

    let images = [];
    let tokenData = parseJwt();
    let userId = tokenData.userid;
    if (Object.keys(this.state.images).length > 0) {
      let selectedFiles = { ...this.state.images };
      Object.values(selectedFiles).forEach((file) => {
        images.push(
          `timesheet/${userId}/${new Date().getTime()}-${file.name.replace(
            /&/g,
            ""
          )}`
        );
      });
      var self = this;
      self.setState({ loading: true });

      let uploadUrl = Constants.BASE_URL + "upload/generate-signed-urls";
      axios
        .post(uploadUrl, { imageNames: images, token: getToken() })
        .then(function (response) {
          if (response.data.success) {
            let uploadedFiles = [...self.state.images];
            response.data.data.forEach(async (directObj, index) => {
              const formData = new FormData();
              formData.append("key", directObj.params.key);
              formData.append("acl", directObj.params.acl);
              formData.append(
                "x-amz-credential",
                directObj.params["x-amz-credential"]
              );
              formData.append(
                "x-amz-algorithm",
                directObj.params["x-amz-algorithm"]
              );
              formData.append("x-amz-date", directObj.params["x-amz-date"]);
              formData.append("policy", directObj.params["policy"]);
              formData.append(
                "x-amz-signature",
                directObj.params["x-amz-signature"]
              );
              formData.append("file", uploadedFiles[index]);
              await fetch(directObj.form_url, {
                method: "POST",
                body: formData,
              });
            });
            self.addTimeSheet(images);
          }
        })
        .catch(function (error) {
          self.setState({ loading: false });
        });
    } else {
      this.addTimeSheet([]);
    }
  };

  addTimeSheet = (images) => {
    var url = Constants.BASE_URL + "timesheet/add";
    var self = this;
    self.setState({ loading: true });
    var payload = {
      token: localStorage.getItem("token"),
      StartTime: self.state.StartTime,
      Hours: self.state.Hours,
      clientId: self.state.clientId,
      classId: self.state.classId,
      taskId: self.state.taskId,
      isBillable: self.state.isBillable,
      Description: self.state.Description,
      notes: self.state.notes,
      images: images,
      empId: self.state.empData["Id"],
    };
    $("#call-modal-form").removeClass("show");
    $("#call-modal-form").css("display", "");
    $(".modal-backdrop.fade.show").remove();

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          let fileUpload = document.getElementById("file_upload");
          if (fileUpload) {
            fileUpload["value"] = "";
          }
          self.setState({
            StartTime: new Date(),
            Hours: "",
            clientId: "",
            classId: "",
            taskId: "",
            isBillable: false,
            Description: "",
            notes: "",
            images: [],
            timesheets: self.state.timesheets.concat([response.data.data]),
          });
        }
      })
      .catch(function (error) {
        self.setState({ loading: false });
      });
     
  };

  handlePageClick = (data) => {
    const from = data.selected * 10;
    var self = this;

    var payload = {
      token: localStorage.getItem("token"),
      from: from,
    };

    var url = Constants.BASE_URL + "timesheet/list";

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          self.setState({
            timesheets: response.data.data,
            isLoading: false,
          });
        }
      })
      .catch(function (error) {
        self.setState({
          isLoading: false,
        });
        console.log(error);
      });
  };

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

  reteiveImages = (images) => {
    const imagesSet = [];

    images.forEach((image) => {
      imagesSet.push({
        src: image.startsWith("http") ? image : `${Constants.AWS_URL}${image}`,
      });
    });
    return imagesSet;
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

  takePhoto = () => {
    this.setState({ displayCamera: true });
    fscreen.requestFullscreen(document.getElementById("camera"));
  };

  handleTakePhoto = async (dataUri) => {
    let file = await fetch(dataUri)
      .then((r) => r.blob())
      .then(
        (blobFile) => new File([blobFile], "Attachement", { type: "image/png" })
      );
    if (this.state.images && this.state.images.length) {
      var images = Array.from(this.state.images);
      images.push(file);
      this.setState({
        images: images,
      });
    } else {
      this.setState({ images: [file] });
    }
    fscreen.exitFullscreen();
    this.setState({ displayCamera: false });
  };

  onCameraError = (error) => {
    ToastsStore.error("Please give permission to access the camera!");
    fscreen.exitFullscreen();
  };

  removeFile = (event, name) => {
    var images = Array.from(this.state.images);
    images = images.filter((img) => img.name !== name);
    this.setState({ images: images });
  };

  updateModal = async (index) => {
    if (
      this.state.timesheets[index] &&
      this.state.timesheets[index]["status"] != "Approved" &&
      this.state.timesheets[index]["status"] != "Rejected" &&
      this.state.timesheets[index]["status"] != "Archived"
    ) {
      if (
        this.state.timesheets[index].images &&
        this.state.timesheets[index].images.length
      ) {
        var ids = this.state.clientTasks[
          this.state.timesheets[index].client[0]["Id"]
        ];
        this.setState({
          id: this.state.timesheets[index]._id,
          hours: this.state.timesheets[index].Hours,
          description: this.state.timesheets[index].Description,
          time: this.state.timesheets[index].StartTime,
          notes: this.state.timesheets[index].notes,
          client: this.state.timesheets[index].client[0],
          imgUrls: this.state.timesheets[index].images,
          image: [],
          billable:
            this.state.timesheets[index].BillableStatus == "Billable"
              ? true
              : false,
          time: new Date(),
          class: this.state.timesheets[index].class[0],
          taskId:
            this.state.timesheets[index].task &&
            this.state.timesheets[index].task.length
              ? this.state.timesheets[index].task[0]["Id"]
              : "",
          taskDropdown: this.state.tasks.filter(
            (task) => ids.indexOf(task["Id"]) != -1
          ),
        });
        // for (var i = 0; i < imageSet.length; i++) {
        //   let res = await fetch(imageSet[i]["src"], {
        //     method: "GET",
        //   });
        //   images.push(res);
        // }
        // this.setState({ image: images });
      } else {
        var ids = this.state.clientTasks[
          this.state.timesheets[index].client[0]["Id"]
        ];
        this.setState({
          id: this.state.timesheets[index]._id,
          hours: this.state.timesheets[index].Hours,
          description: this.state.timesheets[index].Description,
          time: this.state.timesheets[index].StartTime,
          notes: this.state.timesheets[index].notes,
          client: this.state.timesheets[index].client[0],
          image: [],
          billable:
            this.state.timesheets[index].BillableStatus == "Billable"
              ? true
              : false,
          time: new Date(),
          class: this.state.timesheets[index].class[0],
          taskId:
            this.state.timesheets[index].task &&
            this.state.timesheets[index].task.length
              ? this.state.timesheets[index].task[0]["Id"]
              : "",
          taskDropdown: this.state.tasks.filter(
            (task) => ids.indexOf(task["Id"]) != -1
          ),
        });
      }
    } else {
      ToastsStore.error(
        "Approved/Archived/Rejected timesheets cannot be edited!"
      );
    }
  };

  handleTimeChange = (time) => {
    this.setState({
      time: time,
    });
  };

  toggleUpdateChange = (event) => {
    this.setState({ billable: !this.state.billable });
  };

  handleFileUpdateChange = (event) => {
    if (this.state.image && this.state.image.length) {
      var image = Array.from(this.state.image);
      image.push(...event.target.files);
      this.setState({ image: image });
    } else
      this.setState({
        image: event.target.files || [],
      });
  };

  removeFileUpdate = (event, name) => {
    var image = Array.from(this.state.image);
    image = image.filter((img) => this.state.image !== name);
    this.setState({ image: image });
  };

  removeImageUrl = (event, url) => {
    var imageUrl = this.state.imgUrls;
    imageUrl = imageUrl.filter((imurl) => imurl != url);
    this.setState({ imgUrls: imageUrl });
  };

  handleUpdate = (event) => {
    event.preventDefault();

    let image = [];
    let tokenData = parseJwt();
    let userId = tokenData.userid;
    if (Object.keys(this.state.image).length > 0) {
      let selectedFiles = { ...this.state.image };
      Object.values(selectedFiles).forEach((file) => {
        image.push(
          `timesheet/${userId}/${new Date().getTime()}-${
            file && file.name ? file.name.replace(/&/g, "") : ""
          }`
        );
      });
      var self = this;
      self.setState({ loading: true });

      let uploadUrl = Constants.BASE_URL + "upload/generate-signed-urls";
      axios
        .post(uploadUrl, { imageNames: image, token: getToken() })
        .then(function (response) {
          if (response.data.success) {
            let uploadedFiles = [...self.state.image];
            response.data.data.forEach(async (directObj, index) => {
              const formData = new FormData();
              formData.append("key", directObj.params.key);
              formData.append("acl", directObj.params.acl);
              formData.append(
                "x-amz-credential",
                directObj.params["x-amz-credential"]
              );
              formData.append(
                "x-amz-algorithm",
                directObj.params["x-amz-algorithm"]
              );
              formData.append("x-amz-date", directObj.params["x-amz-date"]);
              formData.append("policy", directObj.params["policy"]);
              formData.append(
                "x-amz-signature",
                directObj.params["x-amz-signature"]
              );
              formData.append("file", uploadedFiles[index]);
              await fetch(directObj.form_url, {
                method: "POST",
                body: formData,
              });
            });
            self.updateTimeSheet(image);
          }
        })
        .catch(function (error) {
          self.setState({ loading: false });
        });
    } else {
      this.updateTimeSheet([]);
    }
  };

  updateTimeSheet = (images) => {
    var url = Constants.BASE_URL + "timesheet/update";
    var self = this;
    if (this.state.imgUrls) {
      if (images) images.push(...this.state.imgUrls);
      else images = [...this.state.imgUrls];
    }
    self.setState({ loading: true });
    var payload = {
      token: localStorage.getItem("token"),
      time: self.state.time,
      hours: self.state.hours,
      client: self.state.client,
      class: self.state.class,
      //taskId: self.state.taskId,
      billable: self.state.billable,
      description: self.state.description,
      notes: self.state.notes,
      image: images,
      id: self.state.id,
    };

    $("#call-modal-form-filled").removeClass("show");
    $("#call-modal-form-filled").css("display", "");
    $(".modal-backdrop.fade.show").remove();

    axios
      .post(url, payload)
      .then(function (response) {
        if (response.data.success) {
          // console.log(response.data);
          // let fileUpload = document.getElementById("file_upload");
          // if (fileUpload) {
          //   fileUpload["value"] = "";
          // }
          // self.setState({
          //   time: new Date(),
          //   hours: "",
          //   client: "",
          //   class: "",
          //   // taskId: "",
          //   billable: false,
          //   description: "",
          //   notes: "",
          //   image: [],
          //   timesheets: response.data.data,
          // });
          self.setState({ loading: false });
          window.location.reload(false);
          ToastsStore.success(response.data.message);
        }
      })
      .catch(function (error) {
        self.setState({ loading: false });
      });
  };

  render() {
    
    return this.state.isLoading ? (
      <div className="centered">
        <ReactLoading
          type="spin"
          color="#2B70A0"
          height={"64px"}
          width={"64px"}
        />
      </div>
    ) : (
      <React.Fragment>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
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
        <div className="text-right">
          <button
            className="btn btn-icon btn-3 btn-primary text-right"
            type="button"
            data-toggle="modal"
            data-target="#call-modal-form"
          >
            <span className="btn-inner--icon">
              <Icon
                path={mdiPlus}
                title="Dashboard"
                size={1}
                horizontal
                vertical
                rotate={180}
                color="#ffffff"
              />
            </span>

            <span className="btn-inner--text">Add</span>
          </button>
          <div
            className="modal fade"
            id="call-modal-form"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modal-form"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal- modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body p-0">
                  <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                      <div className="row align-items-center">
                        <div className="col-6">
                          <h3 className="mb-0">My Time</h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-body text-left">
                      <form onSubmit={this.handleSubmit}>
                        <div className="pl-lg-4">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Activity Date
                                </label>
                                <div className="input-group input-group-alternative">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <Icon
                                        path={mdiCalendar}
                                        title="calendar"
                                        size={0.9}
                                        horizontal
                                        vertical
                                        rotate={180}
                                        color="#5e72e4"
                                        className="mr-2"
                                      />
                                    </span>
                                  </div>
                                  <DatePicker
                                    className="form-control datepicker"
                                    selected={this.state.StartTime}
                                    onChange={this.handleDateChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  Hours
                                </label>
                                <input
                                  type="number"
                                  id="input-hours"
                                  className="form-control form-control-alternative"
                                  placeholder="Hours"
                                  name="Hours"
                                  value={this.state.Hours}
                                  onChange={this.handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="client"
                                >
                                  Client
                                </label>
                                
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="clientId"
                                  id="client"
                                  // value="lol"
                                  value={this.state.value}
                                  onChange={this.handleClientChange}
                                >
                                  
                                  {/* {this.state.clients.map((client, index) => (
                                    <React.Fragment>
                                      <option
                                        value={client._id}
                                        key={`client${index}`}
                                      >
                                        {client.FullyQualifiedName}
                                        
                                      </option>
                                    </React.Fragment>
                                  
                                  ))} */}
                                  {/* <option>{this.state.clientList}</option> */}
                                  {/* {this.state.clientList.map((client, index) => (
                                    <React.Fragment>
                                      <option
                                        value={client._id}
                                        // key={`client${index}`}
                                      >
                                        {/* {client.FullyQualifiedName} */}
                                        {/* {client[0].Hours} */}
                                        {/* {console.log(client[0])}
                                      </option>
                                    </React.Fragment>
                                  
                                  ))} */} 
                                  
                                  {this.state.clientList.map((clientsList, index) => {
                                    return <option value={clientsList.CompanyName}>{clientsList.CompanyName}</option>;
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="task"
                                >
                                  Service
                                </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="taskId"
                                  id="task"
                                  value={this.state.selectValue}
                                  onChange={this.handleTaskChange}
                                >
                                  {/* {this.state.taskDropdown
                                    ? this.state.taskDropdown.map(
                                        (task, index) => (
                                          <React.Fragment>
                                            <option
                                              value={task._id}
                                              key={`class${index}`}
                                            >
                                              {task.FullyQualifiedName}
                                            </option>
                                          </React.Fragment>
                                        )
                                      )
                                    : ""} */}
                                    {this.state.taskList.map((tasksList, index) => {
                                    return <option value={tasksList.FullyQualifiedName}>{tasksList.FullyQualifiedName}</option>;
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group mt-4">
                                <div className="custom-control custom-control-alternative custom-checkbox">
                                  <input
                                    className="custom-control-input"
                                    id=" customCheckLogin"
                                    type="checkbox"
                                    checked={this.state.isBillable}
                                    onChange={this.toggleChange}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor=" customCheckLogin"
                                  >
                                    <span>Variation?</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Description
                                </label>
                                <textarea
                                  rows="4"
                                  cols="50"
                                  type="text"
                                  id="input-last-name"
                                  className="form-control form-control-alternative"
                                  placeholder="Description"
                                  name="Description"
                                  value={this.state.Description}
                                  onChange={this.handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Variation Notes
                                </label>
                                <textarea
                                  rows="4"
                                  cols="50"
                                  id="input-last-name"
                                  className="form-control form-control-alternative"
                                  placeholder="Notes"
                                  name="notes"
                                  value={this.state.notes}
                                  onChange={this.handleChange}
                                  required={this.state.isBillable}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  for="file_upload"
                                >
                                  Attachements
                                </label>
                                <input
                                  type="file"
                                  multiple
                                  id="file_upload"
                                  className="form-control form-control-alternative"
                                  placeholder="Images"
                                  name="images"
                                  onChange={this.handleFileChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="btn btn-secondary"
                                  for="camera"
                                >
                                  Take a photo
                                </label>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  capture="camera"
                                  className="form-control form-control-alternative"
                                  id="camera"
                                  name="camera"
                                  style={{ display: "none" }}
                                  onChange={this.handleFileChange}
                                ></input>
                              </div>
                            </div>
                            {this.state.images && this.state.images.length
                              ? Array.from(this.state.images).map((img) => (
                                  <div>
                                    <span>{img.name}</span>
                                    <button
                                      type="button"
                                      className="btn btn-icon"
                                      name={img.name}
                                      onClick={(event) =>
                                        this.removeFile(event, img.name)
                                      }
                                    >
                                      <Icon
                                        path={mdiDelete}
                                        title="delete"
                                        size={0.9}
                                        horizontal
                                        vertical
                                        rotate={180}
                                        color="#5e72e4"
                                        className="mr-2"
                                      />
                                    </button>
                                  </div>
                                ))
                              : ""}
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-link"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Create
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-items-center table-flush mt-2">
            <thead className="thead-light">
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Hours</th>
                <th scope="col">Date</th>
                <th scope="col">Images</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {this.state.timesheets.map((timesheet, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge badge-dot mr-4">
                      {/* {timesheet.client[0].DisplayName} */}
                      {timesheet.CustomerRef.value}
                      {/* {timesheet.Description} */}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-dot mr-4">
                      {timesheet.Hours}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span>{Moment(timesheet.StartTime).format("LL")}</span>
                    </div>
                  </td>
                  <td>
                    <div
                      class="avatar-group"
                      onClick={(event) =>
                        this.displayImages(timesheet.images, event)
                      }
                    >
                      {timesheet.images.length > 0
                        ? timesheet.images.map((image, imageIndex) => (
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
                  </td>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      data-toggle="popover"
                      data-color="default"
                      data-placement="top"
                      data-content={timesheet.Description}
                    >
                      <span
                        className="d-inline-block text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {timesheet.Description}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      data-toggle="popover"
                      data-color="default"
                      data-placement="top"
                      data-content={timesheet.Description}
                    >
                      <span
                        className="d-inline-block text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {timesheet.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="dropdown">
                      <a
                        className="btn btn-sm btn-icon-only text-light"
                        href="/"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <Icon
                          path={mdiDotsVertical}
                          title="Dashboard"
                          size={1}
                          horizontal
                          vertical
                          rotate={180}
                          color="#000000"
                        />
                      </a>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        <button
                          className="dropdown-item"
                          //className="btn btn-icon btn-3 btn-primary text-right"
                          type="button"
                          data-toggle="modal"
                          data-target="#call-modal-form-filled"
                          disabled={
                            timesheet.status == "Approved" ||
                            timesheet.status == "Rejected" ||
                            timesheet.status == "Archived"
                          }
                          onClick={() => this.updateModal(index)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.totalCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            containerClassName={"pagination justify-content-center"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />

          <div
            className="modal fade"
            id="call-modal-form-filled"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modal-form"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal- modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body p-0">
                  <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                      <div className="row align-items-center">
                        <div className="col-6">
                          <h3 className="mb-0">My Time</h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-body text-left">
                      <form onSubmit={this.handleUpdate}>
                        <div className="pl-lg-4">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-country"
                                >
                                  Activity Date
                                </label>
                                <div className="input-group input-group-alternative">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <Icon
                                        path={mdiCalendar}
                                        title="calendar"
                                        size={0.9}
                                        horizontal
                                        vertical
                                        rotate={180}
                                        color="#5e72e4"
                                        className="mr-2"
                                      />
                                    </span>
                                  </div>
                                  {/* <span>
                                      {Moment(timesheet.StartTime).format("LL")}
                                    </span> */}
                                  <DatePicker
                                    className="form-control datepicker"
                                    // value={Moment(timesheet.StartTime).format(
                                    //   "LL"
                                    // )}
                                    value={Moment(this.state.time).format("LL")}
                                    selected={this.state.time}
                                    onChange={this.handleTimeChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  Hours
                                </label>
                                <input
                                  type="number"
                                  id="input-hours"
                                  className="form-control form-control-alternative"
                                  placeholder="Hours"
                                  name="hours"
                                  value={this.state.hours}
                                  onChange={this.handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="client"
                                >
                                  Client
                                </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="client"
                                  id="client"
                                  //value={timesheet.client[0].DisplayName}
                                  value={
                                    this.state.client
                                      ? this.state.client["_id"]
                                      : ""
                                  }
                                  onChange={this.handleChange}
                                >
                                  <option value=""></option>
                                  {this.state.clients.map((client, index) => (
                                    <React.Fragment>
                                      <option
                                        value={client._id}
                                        key={`client${index}`}
                                      >
                                        {client.FullyQualifiedName}
                                      </option>
                                    </React.Fragment>
                                  ))}
                                </select>
                              </div>
                            </div>
                            {/* <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="taskId"
                                >
                                  Activity
                                </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="taskId"
                                  id="taskId"
                                  value={this.state.taskId}
                                  onChange={this.handleChange}
                                >
                                  <option value=""></option>
                                  {this.state.tasks.map((task, index) => (
                                    <React.Fragment>
                                      <option
                                        value={task._id}
                                        key={`task${index}`}
                                      >
                                        {task.FullyQualifiedName}
                                      </option>
                                    </React.Fragment>
                                  ))}
                                </select>
                              </div>
                            </div> */}
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="class"
                                >
                                  Service
                                </label>
                                <select
                                  className="form-control input-group input-group-alternative"
                                  name="class"
                                  id="class"
                                  value={this.state.taskId}
                                  onChange={this.handleChange}
                                >
                                  <option value=""></option>
                                  {this.state.taskDropdown.map(
                                    (task, index) => (
                                      <React.Fragment>
                                        <option
                                          value={task._id}
                                          key={`class${index}`}
                                        >
                                          {task.FullyQualifiedName}
                                        </option>
                                      </React.Fragment>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group mt-4">
                                <div className="custom-control custom-control-alternative custom-checkbox">
                                  <input
                                    className="custom-control-input"
                                    id=" customCheckLogin"
                                    type="checkbox"
                                    checked={this.state.billable}
                                    onChange={this.toggleUpdateChange}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor=" customCheckLogin"
                                  >
                                    <span>Variation?</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Description
                                </label>
                                <textarea
                                  rows="4"
                                  cols="50"
                                  type="text"
                                  id="input-last-name"
                                  className="form-control form-control-alternative"
                                  placeholder="Description"
                                  name="description"
                                  value={this.state.description}
                                  onChange={this.handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Variation Notes
                                </label>
                                <textarea
                                  rows="4"
                                  cols="50"
                                  id="input-last-name"
                                  className="form-control form-control-alternative"
                                  placeholder="Notes"
                                  name="notes"
                                  value={this.state.notes}
                                  onChange={this.handleChange}
                                  required={this.state.isBillable}
                                />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="form-control-label"
                                  for="file_upload"
                                >
                                  Attachements
                                </label>

                                <input
                                  type="file"
                                  multiple
                                  id="file_upload"
                                  className="form-control form-control-alternative"
                                  placeholder="Images"
                                  name="image"
                                  onChange={this.handleFileUpdateChange}
                                />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-group">
                                <label
                                  className="btn btn-secondary"
                                  for="camera"
                                >
                                  Take a photo
                                </label>

                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  capture="camera"
                                  className="form-control form-control-alternative"
                                  id="camera"
                                  name="camera"
                                  style={{ display: "none" }}
                                  onChange={this.handleFileUpdateChange}
                                ></input>
                                <br />

                                {this.state.imgUrls != undefined &&
                                this.state.imgUrls.length ? (
                                  Array.from(this.state.imgUrls).map(
                                    (imgUrl) => (
                                      <div>
                                        <span>{imgUrl.split("/")[2]}</span>
                                        <button
                                          type="button"
                                          className="btn btn-icon"
                                          name={imgUrl}
                                          onClick={(event) =>
                                            this.removeImageUrl(event, imgUrl)
                                          }
                                        >
                                          <Icon
                                            path={mdiDelete}
                                            title="delete"
                                            size={0.9}
                                            horizontal
                                            vertical
                                            rotate={180}
                                            color="#5e72e4"
                                            className="mr-2"
                                          />
                                        </button>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p>No Old Attachments Uploaded</p>
                                )}

                                {this.state.image && this.state.image.length
                                  ? Array.from(this.state.image).map((img) => (
                                      <div>
                                        <span>{img.name}</span>
                                        <button
                                          type="button"
                                          className="btn btn-icon"
                                          name={img.name}
                                          onClick={(event) =>
                                            this.removeFileUpdate(
                                              event,
                                              img.name
                                            )
                                          }
                                        >
                                          <Icon
                                            path={mdiDelete}
                                            title="delete"
                                            size={0.9}
                                            horizontal
                                            vertical
                                            rotate={180}
                                            color="#5e72e4"
                                            className="mr-2"
                                          />
                                        </button>
                                      </div>
                                    ))
                                  : ""}
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-link"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

MyTime.displayName = "Gallery";
MyTime.propTypes = {
  preventScroll: PropTypes.bool,
  spinner: PropTypes.func,
  spinnerColor: PropTypes.string,
  spinnerSize: PropTypes.number,
  theme: PropTypes.object,
  heading: PropTypes.string,
  imgs: PropTypes.array,
  showThumbnails: PropTypes.bool,
  subheading: PropTypes.string,
};

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

export default MyTime;
