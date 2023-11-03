import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta, getElevenSportDtaFifa } from '../../api/api';
import { copy } from '../../utils/copy';

class FifaWorld extends Component {

    state = {
        feedback_msg: null,
        events:[],
        loading:true,
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
        if (previousState.tabId !== this.state.tabId) {
            this.setState({loading:true})
            let res = await getElevenSportDtaFifa(this.state.tabId)
            console.log(res.data)
            let channels = res.data.events
            this.setState({events:channels})
            this.setState({loading:false})
        }
    }
    async componentDidMount() {
        this.setState({loading:true})
        let res = await getElevenSportDtaFifa(this.state.tabId)
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
             
                let re720=this.state.tabId!=="EVENT_STATUS_SCHEDULED"?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"720p/playlist"):''
                let re1080=this.state.tabId!=="EVENT_STATUS_SCHEDULED"?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"1080p/playlist"):''
                return(
                    <tr key={itemData.id }>
                         <td>{itemData.id } </td>
                        <td>{ itemData.title} </td>
                        <td>{itemData. location.physical.country_code}</td>
                        <td>{itemData.metadata.competition_name}</td>
                        <td>{itemData.start_time  }</td>
                        <td>{itemData.status}</td>

                       
                     
                       
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&  <td>
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(re1080)}>Copy</button>
                           
                        </td>}
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&  <td>
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(re720)}>Copy</button>
                           
                        </td>}
                        {this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&  <td>
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(itemData.metadata?.mcls_internal_data[0]?.value)}>Copy</button>
                           
                        </td>}
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
                        <th scope="col">Status	</th>
                       <th scope="col">value 1080p</th>
                        <th scope="col">value 720p</th>
                        <th scope="col">value</th>
               
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

             {/*    <button className='btn btn-primary float-right mt-2' onClick={this.addStudent}><i className='fas fa-plus'></i> Add New Channel</button> <br/> <br/> */}
                <div className='text-center mt-3'>
                    <div className="btn-group" role="group">
                        <button type="button" className={this.state.tabId=="EVENT_STATUS_STARTED"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"EVENT_STATUS_STARTED"})}>LIVE</button>
                        <button type="button" className={this.state.tabId=="EVENT_STATUS_FINISHED"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"EVENT_STATUS_FINISHED"})}>FINISHED</button>
                        <button type="button" className={this.state.tabId=="EVENT_STATUS_SCHEDULED"?"btn btn-dark":"btn btn-outline-dark"}  onClick={() => this.setState({tabId:"EVENT_STATUS_SCHEDULED"})}>SCHEDULE</button>
                    
                    </div>
                </div>
                
                <div class="input-group container" style={{
                    marginTop:20
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" />
           
     </div>
                <div className='mt-5'>
                  {tableContent}
                </div>
            </SidebarTemplate>
        );
    }
}

FifaWorld.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(FifaWorld);
