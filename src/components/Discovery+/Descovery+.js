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
import {
  fetchDiscovery,
  fetchHilightData,
  getElevenSportDta,
} from "../../api/api";
import { copy } from "../../utils/copy";
import axios from "axios";
import ConfigHeader from "./ConfigHeader";

class Discovery extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    tabId: "EVENT_STATUS_STARTED",
    action: 1,
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
    let user = localStorage.getItem("user");
    if (user) {
      let u = JSON.parse(user);
      console.log(u.action);
      this.setState({ action: u.action });
    }
    var channelIds = [
    
      { name: "Nove", code: "311" },
      { name: "Real Time", code: "310" },
      { name: "DMAX", code: "323" },
      { name: "Giallo", code: "312" },
      { name: "K2", code: "313" },
      { name: "Frisbee", code: "314" },
      { name: "MotorTrend", code: "315" },
      { name: "Food Network", code: "319" },
      { name: "Discovery", code: "319" },
      { name: "HGTV", code: "322" },
      { name: "Warner TV", code: "866" },
    ];

    let list = [];
    let api = await fetchDiscovery(this.props.nodeLinks["discovery"].key);
    let data = api.data;
    await Promise.all(
      data.map((el, i) => {
        list.push({
          channel: channelIds[i + 1]?.name ? channelIds[i + 1].name : "No name",
          url: el.data.attributes.streaming[0].url,
          streamMode: el.data.attributes.streaming[0].streamMode,
        });
      })
    );

    this.setState({ events: list });
    this.setState({ loading: false });
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
  onFilter = (e) => {
    let key = e.target.value;
    if (key == "") {
      this.componentDidMount();
    } else {
      let data = this.state.events;
      console.log("ddddddd", data);
      console.log(key);
      var filteredArray = data.filter(function (el) {
        return el.channel.toUpperCase().indexOf(key.toUpperCase()) > -1;
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
      let studentsTable = this.state.events.map((el) => {
        let url = el.url;
        return (
          <tr key={el.url}>
            <td>{el.channel} </td>
            <td>{el.streamMode} </td>

            <td>
              <button
                className={`btn btn-${
                  url.indexOf(".m3u8") > -1
                    ? "success"
                    : url.indexOf(".mpd") > -1
                    ? "warning"
                    : "danger"
                } btn-sm mr-1`}
                onClick={() => copy(url)}
              >
                <i class="fa fa-copy"></i>
              </button>
            </td>
          </tr>
        );
      });

      tableContent = (
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Channel</th>
              <th scope="col">Stream Mode</th>

              <th scope="col">value</th>
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
        <div
          style={{
            margin: 10,
          }}
        >
          <h4>Color Indicator</h4>
          <a
            href="#"
            class="badge badge-success"
            style={{
              marginRight: 10,
            }}
          >
            m3u8
          </a>
          <a
            href="#"
            class="badge badge-warning"
            style={{
              marginRight: 10,
            }}
          >
            mpd
          </a>
          <a
            href="#"
            class="badge badge-danger"
            style={{
              marginRight: 10,
            }}
          >
            error
          </a>
        </div>
        {(this.props.isAdmin || this.state.action == 0) && (
          <ConfigHeader
            discoveryLink={this.props.nodeLinks["discovery"]}
            onFilter={this.onFilter}
          ></ConfigHeader>
        )}
        <div className="mt-5">{tableContent}</div>
      </SidebarTemplate>
    );
  }
}

Discovery.propTypes = {
  student: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  student: state.student,
  message: state.message,
  isAdmin: state.admin.isAdmin,
});

export default connect(mapStateToProps, {
  getStudents,
  setMessage,
  deleteStudent,
})(Discovery);
