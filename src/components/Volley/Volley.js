import React, { Component } from "react";
import SidebarTemplate from "../common/SidebarTemplate/SidebarTemplate";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SocksAgent from "axios-socks5-agent";
import HttpsProxyAgent from "https-proxy-agent";
import {
  getStudents,
  setMessage,
  deleteStudent,
} from "../../actions/studentActions";
import { getElevenSportDta } from "../../api/api";
import { copy } from "../../utils/copy";
import Axios from "axios";

class Students extends Component {
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
  async componentDidUpdate(previousProps, previousState) {
    if (previousState.tabId !== this.state.tabId) {
      this.setState({ loading: true });
      let res = await getElevenSportDta(this.state.tabId);
      console.log(res.data);
      let channels = res.data.events;
      this.setState({ events: channels });
      this.setState({ loading: false });
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
  async componentDidMount() {
    let res = await Axios.get(this.props?.nodeLinks?.volley?.key + "/excute");
    this.setState({ events: res.data.data });
    this.setState({loading:false})
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
      let studentsTable = this.state.events.map((itemData) => {
        return (
          <tr key={itemData.id}>
            <td>{itemData.id} </td>
            <td>{itemData.title} </td>
            <td>{itemData.start}</td>
            <td>{itemData.end}</td>

            <td>
              <button
                className="btn btn-success btn-sm mr-1"
                onClick={() => copy(itemData.url)}
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
              <th scope="col">ID</th>
              <th scope="col">Title</th>

              <th scope="col">start_time</th>
              <th scope="col">end_time</th>

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

Students.propTypes = {
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
})(Students);
