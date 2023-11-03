import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta } from '../../api/api';
import { copy } from '../../utils/copy';
import { Link } from 'react-router-dom';
import { baseurl } from '../../utils/config';
import Axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
class Features extends Component {

    state = {
        feedback_msg: null,
        events:this.props.data ,
        loading:false,
        tabId:"EVENT_STATUS_STARTED"
    }

    static getDerivedStateFromProps(props, state) {
        if(props.message.msg) {
            return {
                feedback_msg: props.message.msg
            }
        }
        return null;
    }
   async componentDidUpdate(previousProps, previousState) {
        /* if (previousState.tabId !== this.state.tabId) {
            this.setState({loading:true})
            let res = await getElevenSportDta(this.state.tabId)
            console.log(res.data)
            let channels = res.data.events
            this.setState({events:channels})
            this.setState({loading:false})
        } */
    }
    submit = (id) => {
        confirmAlert({
          title: 'Confirm to delete',
          message: 'Are you sure to delete this section.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteSection(id),
              className:"btn btn-danger"
            },
            {
              label: 'No',
            
            }
          ]
        });
      };

    async componentDidMount() {
       // this.setState({loading:true})
       /*  let res = await getElevenSportDta(this.state.tabId)
        console.log(res.data)
        let channels = res.data.events
        this.setState({events:channels})
        this.setState({loading:false}) */
      /*   const searchData = {
            stage: 'primary'
        }
        this.props.getStudents(searchData); */
    }
 deleteSection=async(id)=>{
  
     var data = JSON.stringify({
        "id":id
      });
      
      var config = {
        method: 'delete',
        url: baseurl+"/deleteFeature",
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      await Axios(config)
      .then(function (response) {
       
      })
      .catch(function (error) {
        console.log(error);
      });
      this.props.reload() 
      
}
    componentWillUnmount() {
        this.props.setMessage(null);
    }

    searchStudent = (stage) => {
        const searchData = {
            stage: stage
        }
        this.props.getStudents(searchData);
    }

    addStudent = () => {
        this.props.history.push('/addfeature');
    }

    onUpdateStudent = (student_id) => {
        this.props.history.push(`update-student/${student_id}`);
    }
    
    onDeleteStudent = (student_id, student_stage) => {
        if(window.confirm('Are You Sure ?')) {
            this.props.deleteStudent(student_id, student_stage);
            // this.props.getStudents({stage: student_stage});
        }
    }
    onFilter=(e)=>{
    
        let key=e.target.value
        if(key==""){
          
          this.setState({events:this.props.data})
      }
    
      
     else {
       
      let data =this.state.events
      console.log("ddddddd",data)
      console.log(key)
      var filteredArray =data.filter(function(el){
          return el.key.toUpperCase().indexOf(key.toUpperCase()) > -1;
        });
        this.setState({events:filteredArray})}
      }
    render() {

        const {loading } = this.state;
        let students=['','','']
        let tableContent;
        if(loading) {
            tableContent = <div className='text-center'><Spinner /></div>;
        }
        else if(loading === false && students === null) {
            tableContent = <h1 className="display-4 text-danger">No data Found :(</h1>
        }
        else {        
            let studentsTable = this.state.events.map((itemData,i) => {
             
              
                return(
                    <tr key={itemData.key }>
                          <td >{itemData.key } </td>
                       
                          <td >{itemData?.data?.length } </td>
                       
                     
                       
                      <td >
                      <div style={{
              display:"flex",
              flexDirection:'row'
            }}>
                  <Link className='btn btn-warning btn-sm mr-1' to={{pathname: "/updateFeature",params:{ feature: itemData,id:i, }} } ><i class="fa fa-edit"></i></Link>
                            <button className='btn btn-danger btn-sm mr-1' onClick={()=>this.submit(i)}><i class="fa fa-trash"></i></button>
                           </div>
                        </td>
                        
                       
                    </tr>
                );
            });

            tableContent = (
                <table className="table table-striped table-sm">
                  <thead >
                        <tr>
                        <th scope="col">Section</th>
                        <th scope="col">Data Count</th>
                      
                    <th scope="col">Action</th>
               
                        </tr>
                    </thead>
                    <tbody>
                        {studentsTable}
                    </tbody>
                </table>
            );
        }

        return (
            <SidebarTemplate>

                {/* Start Success Message */}
                {(this.state.feedback_msg) ? 
                    <div className={`alert alert-${this.state.feedback_msg.type} alert-dismissible fade show mt-3`} role="alert">
                        <strong>{this.state.feedback_msg.content}</strong>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                  : null}
                {/* End Success Message */}
                <div style={{
                    display:"flex",
                    flexDirection:"row",
                    marginTop:20,
                alignItems:"center"

                }}>
                <div class="input-group container" style={{
                  
                   
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" onChange={this.onFilter} />
           
     </div>
             <Link to='/addfeature' className='btn btn-primary float-right mt-2' ><i className='fas fa-plus'></i> Add New Section</Link> <br/> <br/> 
                
                </div>
               
                <div className='mt-5'>
                  {tableContent}
                </div>
            </SidebarTemplate>
        );
    }
}

Features.propTypes = {
    student: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getStudents: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    deleteStudent: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    student: state.student,
    message: state.message
})

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Features);
