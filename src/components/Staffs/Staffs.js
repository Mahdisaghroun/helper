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
import axios from "axios";
import ModallAdd from "./ModaAdd";
import Axios from "axios";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { baseurl } from "../../utils/config";
class Staffs extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    tabId: "EVENT_STATUS_STARTED",
    openAddModal:false,
    newarr:[]
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
    let data =this.props.newsection
    let newarr=[]
     data.map(el=>{
     newarr.push(el.key)
    })
   this.setState({newarr:newarr}) 
        if (this.props.admin.isAdmin) {
            console.log('dddddd')
            if (this.props.staffs) {
              this.setState({ events: this.props.staffs });
              this.setState({ loading: false });
            }
          }  

   
  }

  onFilter=(e)=>{
    
    let key=e.target.value
    if(key==""){
      
      this.setState({events:this.props.staffs})
  }

  
 else {
   
  let data = [...this.state.events]
  console.log("ddddddd",data)
  console.log(key)
  var filteredArray = data.filter(function(itm){
      return itm.username.toUpperCase().indexOf(key.toUpperCase()) > -1;
    });
    this.setState({events:filteredArray})}
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
   deleteStaff=async(i)=>{
    var data = JSON.stringify({
        "id": i
      });
      
      var config = {
        method: 'get',
        url: baseurl+'/deleteStaf',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
     let response = await  Axios(config)
     if(response.data.success===true){
        this.setState({events:response.data.staff})
     }
     
  }
  submit = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delete this staff.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.deleteStaff(id),
          className:"btn btn-danger"
        },
        {
          label: 'No',
        
        }
      ]
    });
  };
  onDeleteStudent = (student_id, student_stage) => {
    if (window.confirm("Are You Sure ?")) {
      this.props.deleteStudent(student_id, student_stage);
      // this.props.getStudents({stage: student_stage});
    }
  };

  render() {
    console.log(this.props)
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
      let studentsTable = this.state.events.map((el,i) => {
        return (
          <tr key={el.username}>
            <td>{el.username} </td>
            <td>{el.password} </td>
            <td>
              {el.privillege?.map((el,i) => (
                <span style={{
                    color:"blueviolet",
                    marginRight:10
                }}>[ {el} ]</span>
              ))}
            </td>
            <td>{el?.action==0?"Read / Write":"Read Only"} </td>
            <td>
            <div style={{
              display:"flex",
              flexDirection:'row'
            }}>
            <button
                className={`btn btn-warning btn-sm mr-1`}
                onClick={()=>{
                  
                  this.setState({user:el})
                  this.setState({id:i})
                  this.setState({openAddModal:true})}}
                style={{
               marginRight:10
                }}
              >
                <i class="fa fa-edit"></i>
              </button>
              <button
                className={`btn btn-danger btn-sm mr-1`}
                onClick={() => this.submit(i)}
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
        <div style={{
           display:"flex",
           flexDirection:'row'
        }}>
        <div class="input-group container" style={{
                    marginTop:20,
                   
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" onChange={this.onFilter}/>
           
     </div>
       <button className='btn btn-primary float-right mt-2' onClick={()=>{this.setState({openAddModal:true})}
      
      }><i className='fas fa-plus'></i> Add New Staff</button> 
      </div>
        <div className="mt-5">{tableContent}</div>
       {this.state.openAddModal&& <ModallAdd
       newsection={this.state.newarr}
       onre={()=>{
        this.setState({user:null,id:null})
       }}
       user={this.state.user} id={this.state.id} isOpenAdded={true} reload={(data)=>{
        
        this.setState({events:data})
        this.setState({openAddModal:false})
        
        
        }} onClose={()=>{
          
          this.setState({user:null,id:null})
          
          this.setState({openAddModal:false})}}></ModallAdd>}
      </SidebarTemplate>
    );
  }
}

Staffs.propTypes = {
  student: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  student: state.student,
  message: state.message,
  admin: state.admin
});

export default connect(mapStateToProps, {
  getStudents,
  setMessage,
  deleteStudent,
})(Staffs);
