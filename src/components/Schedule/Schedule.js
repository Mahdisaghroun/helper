import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta } from '../../api/api';
import { copy } from '../../utils/copy';
import { ScheduleEvents } from './ScheduleData';
import ScheduleCard from './ScheduleCard';
import ConfigHeader from './ConfigHeader';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
class Schedule extends Component {

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
   async componentDidUpdate(previousProps, previousState) {
        if (previousState.tabId !== this.state.tabId) {
            this.setState({loading:true})
            let res = await getElevenSportDta(this.state.tabId)
            console.log(res.data)
            let channels = res.data.events
            this.setState({events:channels})
            this.setState({loading:false})
        }
    }
    onFilter=(key)=>{
        if(key==""){
            this.componentDidMount()
        }
        console.log(key)
        let data = [...this.state.data]
        console.log(data)
        var filteredArray = data.filter(function(itm){
            return itm.key.indexOf(key?.toUpperCase()) > -1;
          });
          this.setState({data:filteredArray})
    }
    async componentDidMount() {
        let user = localStorage.getItem('user')
        if(user){
            let u = JSON.parse(user)
            console.log(u.action)
            this.setState({action:u.action})
        }
        let arr =[]
       await Promise.all(
         Object.keys(this?.props?.events).map((key, index) =>{
           arr.push({key:key,value:this?.props?.events[key]})

        }))
        this.setState({data:arr})
        this.setState({loading:true})
        let res = await getElevenSportDta(this.state.tabId)
        console.log(res.data)
        let channels = res.data.events
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
        this.props.history.push('/addevents');
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
            let studentsTable = this.state.events.map(itemData => {
             
                let re720=this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&itemData.metadata?.mcls_internal_data?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"720p/playlist"):''
                let re1080=this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&itemData.metadata?.mcls_internal_data?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"1080p/playlist"):''
                return(
                    <tr key={itemData.id }>
                          <td >{itemData.id } </td>
                         <td >{ itemData.title} </td>
                         <td >{itemData. location.physical.country_code}</td>
                         <td >{itemData.metadata.competition_name}</td>
                         <td >{itemData.start_time  }</td>
                         <td >{itemData.status}</td>

                       
                     
                       
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(re1080)}><i class="fa fa-copy"></i></button>
                           
                        </td>}
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <td >
                            <button className='btn btn-info btn-sm mr-1' onClick={()=>copy(re720)}><i class="fa fa-copy"></i></button>
                           
                        </td>}
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <td >
                            <button className='btn btn-secondary btn-sm mr-1' onClick={()=>copy(itemData.metadata?.mcls_internal_data[0]?.value)}><i class="fa fa-copy"></i></button>
                           
                        </td>}
                    </tr>
                );
            });

            tableContent = (
                <table className="table table-striped table-sm">
                  <thead >
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Country code</th>
                        <th scope="col">competition_name</th>
                        <th scope="col">start_time</th>
                        <th scope="col">Status	</th>
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <th scope="col">1080p</th>}
                       {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <th scope="col">720p</th>}
                       {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&   <th scope="col">value</th>}
               
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

          {    (this.state.action==1||this.props.isAdmin)&&  <ConfigHeader reload={this.props.reload} action={this.state.action} onFilter={(e)=>this.onFilter(e.target.value)}></ConfigHeader>}
               
                <div class="row" style={{
                    padding:50
                }}>
{ this.state.data?.map((el, index) =>(
    <ScheduleCard title={el.key} url={el.value}reload={this.props.reload} ></ScheduleCard>
)
  
)}

 
</div>
            </SidebarTemplate>
        );
    }
}

Schedule.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Schedule);
