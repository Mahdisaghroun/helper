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
import { fetchHilightData, getElevenSportDta, GetRaiList } from "../../api/api";
import { copy } from "../../utils/copy";
import axios from "axios";

class Rai extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    tabId: "EVENT_STATUS_STARTED",
  };

  static getDerivedStateFromProps(props, state) {
    if (props.message.msg) {
      return {
        feedback_msg: props.message.msg,
      };
    }
    return null;
  }
  printData = (data) => {
    console.log(data);
    let returnObject;
    var channelName = data.channel?.toLowerCase().replace(/\s/g, "");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(
      "https://www.raiplay.it/dirette/" + channelName + ".json",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "JSESSIONID=I+fqXtyM09WA53SUzaqDxxnS");

        var requestOptionss = {
          method: "get",
          headers: { "Cookie": "JSESSIONID=I+fqXtyM09WA53SUzaqDxxnS" },

          url: result.video.content_url + "&output=64",
        };

        return axios
          .post(this.props.nodeLinks?.rai?.key+"/excutexml", {
         ... requestOptionss,
          })
        
          .then((result) => {
        
          let r =  result.data
          console.log(r)
            let xml = new window.DOMParser().parseFromString(
             r,
              "text/xml"
            );
            let url = xml.getElementsByTagName("url")[0].textContent.trim();

            returnObject = {
              channel: data.channel,
              url: url,
              currentItem: data.currentItem,
            };
            console.log(returnObject)
            return returnObject;
          })
          .catch((error) => {});
      })
      .catch((error) => console.log("error", error));
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
        return el.name.toUpperCase().indexOf(key.toUpperCase()) > -1;
      });
      this.setState({ events: filteredArray });
    }
  };
  async componentDidMount() {
    let list = [];
    this.setState({ loading: true });
    let res = await GetRaiList(this.props.nodeLinks?.rai?.key);
    await Promise.all(
      res.data.on_air.map(async (el, i) => {
        let data = await this.printData(el);
        list.push(data);
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
      let studentsTable = this.state?.events?.map((el) => {
        let url = el?.url;
        return (
          <tr key={el.url}>
            <td>{el.channel} </td>
            <td>{el.currentItem.name} </td>
            <td>{el.currentItem.episode_title} </td>

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
              <th scope="col">Current Item Name</th>
              <th scope="col">Current Item Title</th>

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
        <div
          class="input-group container"
          style={{
            marginTop: 20,
          }}
        >
          <input
            class="form-control border-end-0 border rounded-pill"
            type="text"
            id="example-search-input"
            placeholder="Search"
            onChange={this.onFilter}
          />
        </div>
        <div className="mt-5">{tableContent}</div>
      </SidebarTemplate>
    );
  }
}

Rai.propTypes = {
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
})(Rai);
