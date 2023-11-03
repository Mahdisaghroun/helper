import React, { Component } from "react";
import SidebarTemplate from "../common/SidebarTemplate/SidebarTemplate";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getStudents,
  setMessage,
  deleteStudent,
} from "../../actions/studentActions";
import { fetchHilightData, getElevenSportDta } from "../../api/api";
import { copy } from "../../utils/copy";

import Axios from "axios";
import { baseurl } from "../../utils/config";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import SubmitModal from "../Addfeaure/SubmitModal";
class Addfeature extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    tabId: "EVENT_STATUS_STARTED",
    openAddModal: false,
    th: [],
    data: [],
    inputvalue: "",
    key:this.props.location.params.feature.key,
    path:this.props.location.params.feature.path,
    modalConfirm:false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.message.msg) {
      return {
        feedback_msg: props.message.msg,
      };
    }
    return null;
  }

 componentDidMount(){
this.setState({data:this.props.location.params.feature.data})
this.setState({th:this.props.location.params.feature.th})
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
  
  onDeleteStudent = (student_id, student_stage) => {
    if (window.confirm("Are You Sure ?")) {
      this.props.deleteStudent(student_id, student_stage);
      // this.props.getStudents({stage: student_stage});
    }
  };
  reset = () => {
    this.setState({ data: [], path: "", key: "" });
  };
  updatefeature = async (arr) => {
    var data = JSON.stringify({
        "id":this.props.location.params.id,
        "newdata": {
          "key": this.state.key,
          "path": this.state.path,
          th: [...arr],
          "data": [
            ...this.state.data
          ]
        }
      });
    var config = {
      method: "put",
      url: baseurl + "/updateFeature",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let res = await Axios(config)
      .then(function (response) {
       
        alert("Section Updated ");
      
      })
      .catch(function (error) {
        console.log(error);
      });
      this.setState({modalConfirm:false})
      this.props.reload()
      this.props.history.goBack()
    
    this.reset();
  };
  submit = (fn) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delete this item.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>fn(),
          className:"btn btn-danger"
        },
        {
          label: 'No',
        
        }
      ]
    });
  };
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

        <h1>Update Section</h1>
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
                    //marginTop:30
                  }}
                  onClick={() => {
                    this.submit(()=>{
                      let data = this.state.th;
                    data.splice(i, 1);
                    this.setState({ th: [...data] });
                    })
                    
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

          {this.state.data.map((elp, i) => (
            <>
              <div
                className="row"
                style={{
                  marginTop: 20,
                }}
              >
                <h2
                  style={{
                    marginLeft: 20,
                  }}
                >
                  
                  {"     " + i} -{" "}
                </h2>

                {this.state.th.map((el, ip) => (
                  <div class="form-group col-md-3">
                    <input
                      required
                      type="text"
                      class="form-control"
                      placeholder={"data of " + el}
                      value={elp[el]}
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
                    this.submit(()=>{
                      let data = this.state.data;
                    data.splice(i, 1);
                    this.setState({ data: [...data] });
                    })
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
            style={
              {
                //marginTop:30
              }
            }
            onClick={() => this.setState({modalConfirm:true})}
          >
            {" "}
            <i className="fa fa-plus"></i> Update Section{" "}
          </button>
        </form>
        {this.state.modalConfirm&&<SubmitModal th={this.state.th} submitFn={this.updatefeature} onClose={()=>this.setState({modalConfirm:false})}></SubmitModal>}

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
