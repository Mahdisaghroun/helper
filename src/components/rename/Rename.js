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
import { getElevenSportDta } from "../../api/api";
import { copy } from "../../utils/copy";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Select from "react-select";
import { config } from "dotenv";
import Axios from "axios";
import { baseurl } from "../../utils/config";
class Rename extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    temp: [],
    tabId: "EVENT_STATUS_STARTED",
    options: [],
    config: this.props.nodeLinks,
    nodeLinks: this.props.nodeLinks,
    mainConfig: localStorage.getItem("config")
      ? localStorage.getItem("config")
      : null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.message.msg) {
      return {
        feedback_msg: props.message.msg,
      };
    }
    return null;
  }
  updateLink(key, value) {
    var data = JSON.stringify({
      key: key,
      value: value,
    });

    var config = {
      method: "put",
      url: baseurl + "/updateLink",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    Axios(config)
      .then(function (response) {
        alert("Update OK");
      })
      .catch(function (error) {
        alert("Error Server ");
      });
  }
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].label === obj.location.physical.country_code) {
        console.log("t");
        return true;
      }
    }

    return false;
  }

  onSelect(key) {
    if (key == "All") {
      this.componentDidMount();
    } else {
      let data = this.state.temp;

      var filteredArray = data.filter(function (el) {
        return (
          el.location.physical.country_code
            .toUpperCase()
            .indexOf(key.toUpperCase()) > -1
        );
      });
      this.setState({ events: filteredArray });
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

  onDeleteStudent = (student_id, student_stage) => {
    if (window.confirm("Are You Sure ?")) {
      this.props.deleteStudent(student_id, student_stage);
      // this.props.getStudents({stage: student_stage});
    }
  };

  async update() {
    if (this.state.config.ip?.indexOf("http://") === -1) {
      alert("IP must start with http://");
    } else if (
      this.state.config.ip?.lastIndexOf("/") ===
      this.state.config.ip.length - 1
    ) {
      alert("Please remove / from the end of IP");
    } else {
      let res = await Axios.get(
        this.state.config?.ip + ":" + this.state.config?.port
      );
      if (res.data) {
        localStorage.setItem("config", JSON.stringify(this.state?.config));
        alert("Update Success");
      } else {
        alert("IP or PORT invalid ! ");
      }
    }
  }

  onFilter = (e) => {
    let key = e.target.value;
    if (key == "") {
      this.componentDidMount();
    } else {
      let data = this.state.events;
      console.log("ddddddd", data);
      console.log(key);
      var filteredArray = data.filter(function (el) {
        return el.title.toUpperCase().indexOf(key.toUpperCase()) > -1;
      });
      this.setState({ events: filteredArray });
    }
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
      let studentsTable = this.state.events.map((itemData) => {
        let re720 =
          this.state.tabId !== "EVENT_STATUS_SCHEDULED" &&
          itemData.metadata?.mcls_internal_data
            ? itemData.metadata?.mcls_internal_data[0]?.value.replace(
                "master",
                "720p/playlist"
              )
            : "";
        let re1080 =
          this.state.tabId !== "EVENT_STATUS_SCHEDULED" &&
          itemData.metadata?.mcls_internal_data
            ? itemData.metadata?.mcls_internal_data[0]?.value.replace(
                "master",
                "1080p/playlist"
              )
            : "";
        return (
          <tr key={itemData.id}>
            <td>{itemData.id} </td>
            <td>{itemData.title} </td>
            <td>{itemData.location.physical.country_code}</td>
            <td>{itemData.metadata.competition_name}</td>
            <td>{itemData.start_time}</td>
            <td>{itemData.status}</td>

            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
              <td>
                <button
                  className="btn btn-success btn-sm mr-1"
                  onClick={() => copy(re1080)}
                >
                  <i class="fa fa-copy"></i>
                </button>
              </td>
            )}
            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
              <td>
                <button
                  className="btn btn-info btn-sm mr-1"
                  onClick={() => copy(re720)}
                >
                  <i class="fa fa-copy"></i>
                </button>
              </td>
            )}
            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
              <td>
                <button
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(itemData.metadata?.mcls_internal_data[0]?.value)
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              </td>
            )}
          </tr>
        );
      });

      tableContent = (
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Country code</th>
              <th scope="col">competition_name</th>
              <th scope="col">start_time</th>
              <th scope="col">Status </th>
              {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
                <th scope="col">1080p</th>
              )}
              {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
                <th scope="col">720p</th>
              )}
              {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && (
                <th scope="col">value</th>
              )}
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

        {/*    <button className='btn btn-primary float-right mt-2' onClick={this.addStudent}><i className='fas fa-plus'></i> Add New Channel</button> <br/> <br/> */}

        <div className="mt-5">
          <div class="row clearfix">
            <div class="col-md-12 column">
              <h3>DASHBOARD</h3>
              <table class="table table-bordered table-hover" id="tab_logic">
                <thead>
                  <tr>
                    <th class="text-center">IP+PORT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="addr0">
                    <td>
                      <input
                        type="text"
                        name="name[]"
                        placeholder="Enter IP+PORT"
                        class="form-control"
                        value={this.state.mainConfig}
                        onChange={(e) => {
                          this.setState({ mainConfig: e.target.value });
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="btn btn-success text-center"
                type="button"
                onClick={() => {
                  localStorage.setItem("config", this.state.mainConfig);
                  alert("Update OK");
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
        {Object.keys(this.state.nodeLinks)?.map((el, i) => (
          <div className="mt-5">
            <div class="row clearfix">
              <div class="col-md-12 column">
                <h3>{el}</h3>
                <table class="table table-bordered table-hover" id="tab_logic">
                  <thead>
                    <tr>
                      <th class="text-center">IP+PORT</th>
                      <th class="text-center">START COMMAND</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="addr0">
                      <td>
                        <input
                          type="text"
                          name="name[]"
                          placeholder="Enter IP+PORT"
                          class="form-control"
                          value={this.state.nodeLinks[el].key}
                          onChange={(e) => {
                            let s = this.state.nodeLinks;
                            s[el] ={...s[el] ,key:e.target.value};
                            this.setState({ nodeLinks: s });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name[]"
                          placeholder="START CMD"
                          class="form-control"
                          value={this.state.nodeLinks[el].cmd}
                          onChange={(e) => {
                            let s = this.state.nodeLinks;
                            s[el] ={...s[el] ,cmd:e.target.value};
                            this.setState({ nodeLinks: s });
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="btn btn-success text-center"
                  type="button"
                  onClick={() => this.updateLink(el, this.state.nodeLinks[el])}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </SidebarTemplate>
    );
  }
}

Rename.propTypes = {
  student: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  student: state.student,
  message: state.message,
});

export default connect(mapStateToProps, {
  getStudents,
  setMessage,
  deleteStudent,
})(Rename);
