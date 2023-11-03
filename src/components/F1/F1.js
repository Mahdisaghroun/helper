import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta, getElevenSportDtaFifa, getF1Data, refreshF1Token } from '../../api/api';
import { copy } from '../../utils/copy';
import { channelNames } from './f1Channels';
import ConfigHeader from './ConfigHeader';

class F1 extends Component {

    state = {
        feedback_msg: null,
        events:[],
        loading:true,
        tabId:"EVENT_STATUS_STARTED",
        action:1
    }

    static getDerivedStateFromProps(props, state) {
        if(props.message.msg) {
            return {
                feedback_msg: props.message.msg
            }
        }
        return null;
    }
  
    async componentDidMount() {
        let user = localStorage.getItem('user')
        if(user){
            let u = JSON.parse(user)
            console.log(u.action)
            this.setState({action:u.action})
        }
     
        this.setState({loading:true})
        let res = await getF1Data(this.props.nodeLinks['F1'].key)
        console.log(res.data)
        let channels = res.data
        this.setState({events:channels})
        this.setState({loading:false})
      /*   const searchData = {
            stage: 'primary'
        }
        this.props.getStudents(searchData); */
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
        this.props.history.push('/add-student');
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
          
          this.componentDidMount()
      }
    
      
     else {
       
      let data =this.state.events
      console.log("ddddddd",data)
      console.log(key)
      var filteredArray =data.filter(function(el){
          return channelNames[el?.resultObj.channelId]?.name.toUpperCase().indexOf(key.toUpperCase()) > -1;
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
             if(itemData?.resultObj?.url)
               
                return(
                    <tr key={itemData.systemTime }>
                         <td>{itemData?.resultObj?.channelId} </td>
                        <td>{channelNames[itemData?.resultObj.channelId]?.name} </td>
                      
                        <td>
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy( itemData?.resultObj?.url)}><i class="fa fa-copy"/></button>
                           
                        </td>
                     
                    </tr>
                );
                else if(i==this.state.events.length-1)return(
                    <span className='text-center'>No Data Found from Rights API</span>
                )
            });

            tableContent = (
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                        <th scope="col">Channel ID</th>
                        <th scope="col">Channle Name</th>
                        <th scope="col">Value</th>
                       
                       
               
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
                {(this.props.isAdmin||this.state.action===0)?  <ConfigHeader refreshTokenData={this.refreshTokenData} f1Link={this.props.nodeLinks['F1']} onFilter={this.onFilter}></ConfigHeader>:null}
               
                
                <div className='mt-5'>
                  {tableContent}
                </div>
            </SidebarTemplate>
        );
    }
}

F1.propTypes = {
    student: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getStudents: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    deleteStudent: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    student: state.student,
    message: state.message,
    isAdmin:state.admin.isAdmin
})

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(F1);
