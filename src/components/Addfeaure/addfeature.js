import React, { Component } from "react";
import SidebarTemplate from "../common/SidebarTemplate/SidebarTemplate";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./addFeature.css";
import {
  getStudents,
  setMessage,
  deleteStudent,
} from "../../actions/studentActions";
import { fetchHilightData, getElevenSportDta } from "../../api/api";
import { copy } from "../../utils/copy";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import Axios from "axios";
import { baseurl } from "../../utils/config";
import SubmitModal from "./SubmitModal";

class Addfeature extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    tabId: "EVENT_STATUS_STARTED",
    openAddModal: false,
    th: [""],
    data: [{}],
    inputvalue: "",
    th: ["title", "description", "value"],
    modalConfirm: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.message.msg) {
      return {
        feedback_msg: props.message.msg,
      };
    }
    return null;
  }

  async componentDidMount() {
    if (this.props.admin.isAdmin) {
      console.log("dddddd");
      if (this.props.staffs) {
        this.setState({ events: this.props.staffs });
        this.setState({ loading: false });
      }
    }
  }

  componentWillUnmount() {
    this.props.setMessage(null);
  }

  searchStudent = (stage) => {
    const searchData = {
      stage: stage,
    };
    this.props.getStudents(searchData);
  };

  addStudent = () => {
    this.props.history.push("/add-student");
  };

  onUpdateStudent = (student_id) => {
    this.props.history.push(`update-student/${student_id}`);
  };
  deleteStaff = async (i) => {
    var data = JSON.stringify({
      id: i,
    });

    var config = {
      method: "get",
      url: "http://185.221.173.62:4122/deleteStaf",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let response = await Axios(config);
    if (response.data.success === true) {
      this.setState({ events: response.data.staff });
    }
  };
  onDeleteStudent = (student_id, student_stage) => {
    if (window.confirm("Are You Sure ?")) {
      this.props.deleteStudent(student_id, student_stage);
      // this.props.getStudents({stage: student_stage});
    }
  };
  reset = () => {
    this.setState({ data: [], path: "", key: "" });
  };
  addfeature = async (arr) => {
    var data = JSON.stringify({
      key: this.state.key,
      path: this.state.path,
      th: [...arr],
      data: [...this.state.data],
    });

    var config = {
      method: "post",
      url: baseurl + "/addFeature",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let res = await Axios(config)
      .then(function (response) {
        alert("Section Added ");
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({ modalConfirm: false });
    this.reset();
  };
  submit = (fn) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this item.",
      buttons: [
        {
          label: "Yes",
          onClick: () => fn(),
          className: "btn btn-danger",
        },
        {
          label: "No",
        },
      ],
    });
  };
  submitModal() {
    this.setState({ modalConfirm: true });
  }
  changeOrderTop(i) {
    let data = [...this.state.data];

    const to = { ...data[i - 1] };
    data[i - 1] = { ...data[i] };
    //data.splice(i, 1);
    data[i] = { ...to };
    console.log(data);
    this.setState({ data: [...data] }, () => {
      this.forceUpdate();
    });
  }
  changeOrderDown(i) {
    let data = [...this.state.data];

    const to = { ...data[i + 1] };
    data[i +1] = { ...data[i] };
    //data.splice(i, 1);
    data[i] = { ...to };
    console.log(data);
    this.setState({ data: [...data] }, () => {
      this.forceUpdate();
    });
  }
  render() {
    const { loading } = this.state;
    let students = ["", "", ""];
    let tableContent;
    if (loading) {
      tableContent = (
        <div className="text-center">
          <Spinner />
        </div>
      );
    } else if (loading === false && students === null) {
      tableContent = (
        <h1 className="display-4 text-danger">No data Found :(</h1>
      );
    } else {
      let studentsTable = this.state.events.map((el, i) => {
        return (
          <tr key={el.username}>
            <td>{el.username} </td>
            <td>{el.password} </td>
            <td>
              {el.privillege?.map((el, i) => (
                <span
                  style={{
                    color: "blueviolet",
                    marginRight: 10,
                  }}
                >
                  [ {el} ]
                </span>
              ))}
            </td>
            <td>{el?.action == 0 ? "Read / Write" : "Read Only"} </td>
            <td>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <button
                  className={`btn btn-warning btn-sm mr-1`}
                  onClick={() => {
                    this.setState({ user: el });
                    this.setState({ id: i });
                    this.setState({ openAddModal: true });
                  }}
                  style={{
                    marginRight: 10,
                  }}
                >
                  <i class="fa fa-edit"></i>
                </button>
                <button
                  className={`btn btn-danger btn-sm mr-1`}
                  onClick={() => this.deleteStaff(i)}
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        );
      });

      tableContent = (
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Password</th>
              <th scope="col">Privileges</th>
              <th scope="col">User Action</th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{studentsTable}</tbody>
        </table>
      );
    }

    return (
      <SidebarTemplate>
        {/* Start Success Message */}
        {this.state.feedback_msg ? (
          <div
            className={`alert alert-${this.state.feedback_msg.type} alert-dismissible fade show mt-3`}
            role="alert"
          >
            <strong>{this.state.feedback_msg.content}</strong>
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : null}
        {/* End Success Message */}

        <h1>Add new Section</h1>
        <form
          style={{
            marginTop: 20,
          }}
        >
          <div class="row">
            <div class="col">
              <input
                value={this.state.key}
                type="text"
                class="form-control"
                placeholder="Title"
                onChange={(e) =>
                  this.setState({
                    key: e.target.value,
                  })
                }
              />
            </div>
            <div class="col">
              <input
                value={this.state.path}
                type="text"
                class="form-control"
                placeholder="/path [example /elevensport]"
                onChange={(e) =>
                  this.setState({
                    path: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <hr></hr>
          <h3
            style={{
              marginTop: 10,
            }}
          >
            Table Headers
          </h3>
          <div
            className="row"
            style={{
              marginTop: 20,
            }}
          >
            {this.state.th.map((el, i) => (
              <div className="col-3">
                <div class="form-group ">
                  <input
                    required
                    type="text"
                    value={el}
                    class="form-control"
                    placeholder="new table header"
                    onChange={(e) => {
                      let data = this.state.th;
                      data[i] = e.target.value;

                      this.setState({
                        th: data,
                      });
                    }}
                  />
                </div>

                <button
                  className="btn btn-danger text-center"
                  type="button"
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                  onClick={() => {
                    this.submit(() => {
                      let data = this.state.th;
                      data.splice(i, 1);
                      this.setState({ th: [...data] });
                    });
                  }}
                >
                  <i className="fa fa-times"></i>{" "}
                </button>

                <hr></hr>
              </div>
            ))}
            <button
              className="btn btn-warning text-center"
              type="button"
              style={{
                width: 40,
                height: 40,
                //marginTop:30
              }}
              onClick={() => this.setState({ th: [...this.state.th, ""] })}
            >
              <i className="fa fa-plus"></i>{" "}
            </button>
          </div>
          <hr></hr>
          <h3
            style={{
              marginTop: 10,
            }}
          >
            Data
          </h3>

          {this.state.data.map((el, i) => (
            <>
              <div
                className="row"
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    borderColor: "red",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItem: "center",
                    textAlign: "center",
                    marginLeft: 20,
                    //  padding:10,
                    //backgroundColor:'red'
                  }}
                >
                  <button type="button" onClick={() => this.changeOrderTop(i)}>
                    {" "}
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                  </button>

                  <h2
                    style={{
                      // marginLeft: 20,
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    {"     " + i}
                  </h2>
                  <button type="button">
                    {" "}
                    <i
                      class="fa fa-arrow-down"
                      aria-hidden="true"
                      onClick={() => this.changeOrderDown(i)}
                    ></i>
                  </button>
                </div>

                {this.state.th.map((el, ip) => (
                  <div class="form-group col-md-3">
                    <input
                      required
                      type="text"
                      value={this.state.data[i][el]}
                      class="form-control"
                      placeholder={"data of " + el}
                      onChange={(e) => {
                        let obj = {};
                        obj[el] = e.target.value;
                        let data = this.state.data;
                        data[i] = {
                          ...data[i],
                          ...obj,
                        };
                        this.setState({
                          data: data,
                        });
                        console.log(this.state.data);
                      }}
                    />
                  </div>
                ))}

                <button
                  className="btn btn-warning text-center"
                  type="button"
                  style={{
                    width: 40,
                    height: 40,
                    //marginTop:30
                  }}
                  onClick={() =>
                    this.setState({ data: [...this.state.data, {}] })
                  }
                >
                  {" "}
                  <i className="fa fa-plus"></i>{" "}
                </button>
                <button
                  className="btn btn-danger text-center"
                  type="button"
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 10,
                    //marginTop:30
                  }}
                  onClick={() => {
                    this.submit(() => {
                      let data = this.state.data;
                      data.splice(i, 1);
                      this.setState({ data: [...data] });
                    });
                  }}
                >
                  <i className="fa fa-times"></i>{" "}
                </button>
                <hr></hr>
              </div>
            </>
          ))}
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            style={{
              marginTop: 30,
            }}
            onClick={() => {
              this.submitModal();
            }}
          >
            {" "}
            <i className="fa fa-plus"></i> Add Section{" "}
          </button>
        </form>
        {this.state.modalConfirm && (
          <SubmitModal
            th={this.state.th}
            submitFn={this.addfeature}
            onClose={() => this.setState({ modalConfirm: false })}
          ></SubmitModal>
        )}
      </SidebarTemplate>
    );
  }
}

Addfeature.propTypes = {
  student: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  student: state.student,
  message: state.message,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  getStudents,
  setMessage,
  deleteStudent,
})(Addfeature);
