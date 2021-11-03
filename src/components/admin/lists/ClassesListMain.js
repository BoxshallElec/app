import React, { Component } from "react";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from "react-toasts";
import { httpClient } from "../../../UtilService";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import AddClassListModal from "./AddClassListModal";
import ReactLoading from "react-loading";
import { withConfirmDialogContext } from "../../common/ConfirmDialogProvide";
class ClassesListMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            allClassesList: [],
            classesList: [],
            classesDic: {},
            search: {
                from: 0, size: 10,
                status: ""
            },
            hasMoreResults: false,
            addClassDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                classes: []
            }
        };
    }

    componentDidMount = async () => {
        await this.getClassesList();
    }


    getClassesList = async () => {
        this.setState({ isLoading: true });
        let searchObj = { ...this.state.search }
        let result = await httpClient("class/list", "POST", searchObj);
        if (result.success) {
            let classesDic = result.data.reduce((acc, ele) => {
                acc[ele._id] = ele.class;
                return acc
            }, {})
            let allClassesList = [...result.data];
            let classesList = [...result.data];
            if (this.state.search.status) {
                classesList = classesList.filter(x => this.state.search.status === "active" ? x.Active === true : x.Active === false)
            }
            this.setState({
                allClassesList: allClassesList,
                classesList: classesList,
                classesDic: classesDic,
                hasMoreResults: result.data.length === this.state.search.size,
                isLoading: false
            });
        } else {
            this.setState({ isLoading: false })
            this.showToast("Error while getting my classes", "error")
        }
    }

    getClassesListFrom = (from) => {
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                from: from,
            },
        }), this.getClassesList)
    }

    showToast = (msg, type) => {
        if (type === "success") {
            ToastsStore.success(msg)
        } else {
            ToastsStore.error(msg)
        }
    }

    handleOpenClassDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#list_classes_add_dialog").modal("hide");
        }
        let classes = [...this.state.allClassesList];
        if (editIndex !== undefined) {
            let classObj = this.state.classesList[editIndex];
            let index = classes.findIndex(x => x._id === classObj._id);
            classes.splice(index, 1);
        }
        this.setState({
            addClassDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.classesList[editIndex] } : undefined,
                editIndex: editIndex,
                classes,
            }
        }, () => {
            if (isOpen) {
                window.$("#list_classes_add_dialog").modal("show");
            }
        })
    }

    handleCloseDialog = (data) => {
        window.$("#list_classes_add_dialog").modal("hide");
        this.setState({
            addClassDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                classes: []
            }
        }, () => {
            if (data) {
                this.getClassesListFrom(0)
            }
        })
    }

    handleDelete = (index) => {
        let canDelete = this.canDeleteClass(this.state.classesList[index]);
        if (canDelete) {
            this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
                this.setState({ isLoading: true })

                let result = await httpClient(`class/${this.state.classesList[index]._id}`, "DELETE");
                if (result.success) {
                    this.showToast("Class deleted successfully", "success");
                    let classesList = [...this.state.classesList];
                    classesList.splice(index, 1);
                    this.setState({
                        classesList: classesList,
                        isLoading: false
                    })
                } else {
                    this.setState({ isLoading: false })
                    this.showToast("Error while getting deleting class", "error")
                }
            })
        } else {
            this.props.confirmDialog.show("Can not Delete", "It is linked with another class. You can make in active", async () => { }, "Okay", true);
        }
    }

    handleStatusChange = (event) => {
        let eve = { ...event };
        let selectedStatus = eve.target.value
        let classesList = [...this.state.allClassesList];
        if (selectedStatus) {
            classesList = classesList.filter(x => selectedStatus === "active" ? x.Active === true : x.Active === false)
        }
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                [eve.target.name]: eve.target.value,
                from: 0
            },
            classesList
        }))
    }

    canDeleteClass = (classObj) => {
        console.log("can delete")
        if (classObj.subClass) {
            return false
        }
        let classesList = [...this.state.classesList];
        let subClassIds = classesList.filter(x => x.subClass !== "" && x.subClass !== undefined).map(x => x.subClass);
        return subClassIds.indexOf(classObj._id) > -1 ? false : true
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading && (
                    <div className="centered">
                        <ReactLoading
                            type="spin"
                            color="#2B70A0"
                            height={"64px"}
                            width={"64px"}
                        />
                    </div>
                )}
                <ToastsContainer
                    store={ToastsStore}
                    position={ToastsContainerPosition.TOP_RIGHT}
                />
                <div className="text-right">
                    <select name="status" className="mr-1" value={this.state.search.status} onChange={this.handleStatusChange}>
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="not-active">In Active</option>
                    </select>
                    <button
                        className="btn btn-sm btn-icon btn-3 btn-primary text-right"
                        type="button"
                        onClick={() => this.handleOpenClassDialog(true)}
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
                </div>
                <div className="table-responsive">
                    <table className="table align-items-center table-flush mt-2">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Class</th>
                                <th>Sub Class Of</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.classesList.map((classObj, index) => (
                                <tr key={index}>
                                    <td>
                                        <span >
                                            {classObj.FullyQualifiedName}
                                        </span>
                                    </td>
                                    <td>{classObj.subClass ? this.state.classesDic[classObj.subClass] : "N/A"}</td>
                                    <td>{classObj.Active ? "Active" : "Not Active"}</td>
                                    <td>
                                        <button type="button" onClick={() => this.handleOpenClassDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                        <button type="button" onClick={() => this.handleDelete(index)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {this.state.classesList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">No classes found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <br />
                {/* <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getClassesListFrom(this.state.search.from - this.state.search.size)} disabled={this.state.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getClassesListFrom(this.state.search.from + this.state.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div> */}
                {this.state.addClassDialog.isOpen && (
                    <AddClassListModal classes={this.state.addClassDialog.classes} data={this.state.addClassDialog.data} showToast={this.showToast} handleCloseDialog={this.handleCloseDialog} />
                )}
            </React.Fragment>
        );
    }
}

export default withConfirmDialogContext(ClassesListMain);
