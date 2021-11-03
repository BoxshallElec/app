import React, { Component } from "react";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from "react-toasts";
import { httpClient } from "../../../UtilService";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import AddTaskListModal from "./AddTaskListModal";
import ReactLoading from "react-loading";
import { withConfirmDialogContext } from "../../common/ConfirmDialogProvide";
class ListTasksMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            allTasksList: [],
            tasksList: [],
            tasksDic: {},
            search: {
                from: 0, size: 10,
                status: ""
            },
            hasMoreResults: false,
            taskDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1, tasks: []
            }
        };
    }

    componentDidMount = async () => {
        await this.getTasksList();
    }


    getTasksList = async () => {
        this.setState({ isLoading: true });
        let searchObj = { ...this.state.search }
        let result = await httpClient("task/list", "POST", searchObj);
        if (result.success) {
            let data = []
            let tasksDic = result.data.reduce((acc, ele) => {
                acc[ele._id] = ele.task;
                let x = { ...ele };
                if (x.ParentRef && x.ParentRef.value) {
                    x.ParentRef = x.ParentRef.value
                }
                if (x.ExpenseAccountRef && x.ExpenseAccountRef.value) {
                    x.ExpenseAccountRef = x.ExpenseAccountRef.value
                }
                if (x.ClassRef && x.ClassRef.value) {
                    x.ClassRef = x.ClassRef.value
                }
                data.push(x);
                return acc
            }, {})
            this.setState({
                tasksList: data,
                allTasksList: data,
                tasksDic,
                hasMoreResults: result.data.length === this.state.search.size,
                isLoading: false
            });
        } else {
            this.setState({ isLoading: false })
            this.showToast("Error while getting my tasks", "error")
        }
    }

    getTasksListFrom = (from) => {
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                from: from,
            },
        }), this.getTasksList)
    }

    showToast = (msg, type) => {
        if (type === "success") {
            ToastsStore.success(msg)
        } else {
            ToastsStore.error(msg)
        }
    }

    handleOpenTaskDialog = (isOpen, editIndex) => {
        if (!isOpen) {
            window.$("#list_task_add_dialog").modal("hide");
        }
        let tasks = [...this.state.allTasksList];
        if (editIndex !== undefined) {
            let taskObj = this.state.tasksList[editIndex];
            let index = tasks.findIndex(x => x._id === taskObj._id);
            tasks.splice(index, 1);
        }
        this.setState({
            taskDialog: {
                isOpen: isOpen,
                data: editIndex !== undefined ? { ...this.state.tasksList[editIndex] } : undefined,
                editIndex: editIndex,
                tasks
            }
        }, () => {
            if (isOpen) {
                window.$("#list_task_add_dialog").modal("show");
            }
        })
    }

    handleCloseDialog = (data) => {
        window.$("#list_task_add_dialog").modal("hide");
        this.setState({
            taskDialog: {
                isOpen: false,
                data: undefined,
                editIndex: -1,
                tasks: []
            }
        }, () => {
            if (data) {
                this.getTasksListFrom(0)
            }
        })
    }

    handleDelete = (index) => {
        let canDelete = this.canDeleteTask(this.state.tasksList[index]);
        if (canDelete) {
            this.props.confirmDialog.show("Are you sure", "Do you want to delete", async () => {
                this.setState({ isLoading: true })
                let result = await httpClient(`tasks/${this.state.tasksList[index]._id}`, "DELETE");
                if (result.success) {
                    this.showToast("Task deleted successfully", "success");
                    let tasks = [...this.state.tasksList];
                    tasks.splice(index, 1);
                    this.setState({
                        tasksList: tasks,
                        isLoading: false
                    })
                } else {
                    this.setState({ isLoading: false })
                    this.showToast("Error while getting deleting tasks", "error")
                }
            })
        } else {
            this.props.confirmDialog.show("Can not Delete", "It is linked with another task. You can make in active", async () => { }, "Okay", true);
        }
    }

    handleStatusChange = (event) => {
        let eve = { ...event };
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                [eve.target.name]: eve.target.value,
                from: 0
            },
        }), () => {
            this.getTasksList()
        })
    }

    canDeleteTask = (taskObj) => {
        if (taskObj.subItem) {
            return false
        }
        let tasksList = [...this.state.tasksList];
        let subItemIds = tasksList.filter(x => x.subItem !== "" && x.subItem !== undefined).map(x => x.subItem);
        return subItemIds.indexOf(taskObj._id) > -1 ? false : true;

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
                        onClick={() => this.handleOpenTaskDialog(true)}
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
                                <th scope="col">Task</th>
                                <th scope="col">Type</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tasksList.map((task, index) => (
                                <tr key={index}>
                                    <td>
                                        <span >
                                            {task.Name}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <span>{task.Type ? task.Type : ""}</span>
                                        </div>
                                    </td>
                                    <td>{task.Active ? "Active" : "Not Active"}</td>
                                    <td>
                                        <button type="button" onClick={() => this.handleOpenTaskDialog(true, index)} className="btn btn-sm btn-primary">Edit</button>
                                        <button type="button" onClick={() => this.handleDelete(index)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {this.state.tasksList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center">No Tasks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <br />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getTasksListFrom(this.state.search.from - this.state.search.size)} disabled={this.state.search.from === 0}>Previous</button>
                    <button className="btn btn-outline-danger pagination-btn" onClick={() => this.getTasksListFrom(this.state.search.from + this.state.search.size)} disabled={!this.state.hasMoreResults}>Next</button>
                </div>
                {this.state.taskDialog.isOpen && (
                    <AddTaskListModal subItems={this.state.taskDialog.tasks} data={this.state.taskDialog.data} showToast={this.showToast} handleCloseDialog={this.handleCloseDialog} />
                )}
            </React.Fragment>
        );
    }
}

export default withConfirmDialogContext(ListTasksMain);
