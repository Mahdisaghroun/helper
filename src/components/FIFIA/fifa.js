import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta,getElevenSportDtaFifa } from '../../api/api';
import { copy } from '../../utils/copy';
import Select from 'react-select';

class Fifa extends Component {

    state = {
        feedback_msg: null,
        events: [],
        loading: true,
        tabId: "EVENT_STATUS_STARTED",
        options:[],
        temp:[]
    }

    static getDerivedStateFromProps(props, state) {
        if (props.message.msg) {
            return {
                feedback_msg: props.message.msg
            }
        }
        return null;
    }
    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].label === obj.location.physical.country_code) {
                console.log("t")
                return true;
            }
        }
    
        return false;
    }
    async componentDidUpdate(previousProps, previousState) {
        if (previousState.tabId !== this.state.tabId) {
            this.setState({ loading: true })
            let res = await getElevenSportDtaFifa(this.state.tabId)
            console.log(res.data)
            let channels=res.data.events
           let ccode = [{label:"All",value:"All"}]
            await Promise.all( channels?.map((el,i)=>{
                if(!this.containsObject(el,ccode))
                { ccode.push({label:el.location.physical.country_code,value:el.location.physical.country_code})}
             }))
             console.log(ccode)
             this.setState({options:ccode})
          
            this.setState({ events: channels })
            this.setState({ temp: channels })
            this.setState({ loading: false })
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
          return el.title.toUpperCase().indexOf(key.toUpperCase()) > -1;
        });
        this.setState({events:filteredArray})}
      }
    onSelect(key){
    
        if(key==="All"){
          
          this.componentDidMount()
      }
    
      
     else {
       
      let data =this.state.temp
    
    
      var filteredArray =data.filter(function(el){
          return el.location.physical.country_code.toUpperCase().indexOf(key.toUpperCase()) > -1;
        });
        this.setState({events:filteredArray})}
    }
    async componentDidMount() {
        this.setState({ loading: true })
        let res = await getElevenSportDtaFifa(this.state.tabId)
        console.log(res.data)
        let channels=res.data.events
            let ccode = [{label:"All",value:"All"}]
            await Promise.all( channels?.map((el,i)=>{
                if(!this.containsObject(el,ccode))
                { ccode.push({label:el.location.physical.country_code,value:el.location.physical.country_code})}
             }))
             console.log(ccode)
             this.setState({options:ccode})
          
            this.setState({ events: channels })
            this.setState({ temp: channels })
            this.setState({ loading: false })
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
        if (window.confirm('Are You Sure ?')) {
            this.props.deleteStudent(student_id, student_stage);
            // this.props.getStudents({stage: student_stage});
        }
    }

    render() {

        const { loading } = this.state;
        let students = ['', '', '']
        let tableContent;
        if (loading) {
            tableContent = <div className='text-center'><Spinner /></div>;
        }
        else if (loading === false && students === null) {
            tableContent = <h1 className="display-4 text-danger">No data Found :(</h1>
        }
        else {
            let studentsTable = this.state.events.map(itemData => {

                let re720 = this.state.tabId !== "EVENT_STATUS_SCHEDULED" && itemData.metadata?.mcls_internal_data ? itemData.metadata?.mcls_internal_data[0]?.value.replace('master', "720p/playlist") : ''
                let re1080 = this.state.tabId !== "EVENT_STATUS_SCHEDULED" && itemData.metadata?.mcls_internal_data ? itemData.metadata?.mcls_internal_data[0]?.value.replace('master', "1080p/playlist") : ''
                return (
                    <tr key={itemData.id}>
                        <td >{itemData.id} </td>
                        <td >{itemData.title} </td>
                        <td >{itemData.location.physical.country_code}</td>
                        <td >{itemData.metadata.competition_name}</td>
                        <td >{itemData.start_time}</td>
                        <td >{itemData.status}</td>




                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(re1080)}><i class="fa fa-copy"></i></button>

                        </td>}
                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(re720)}><i class="fa fa-copy"></i></button>

                        </td>}
                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(itemData.metadata?.mcls_internal_data[0]?.value)}><i class="fa fa-copy"></i></button>

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
                            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <th scope="col">1080p</th>}
                            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <th scope="col">720p</th>}
                            {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <th scope="col">value</th>}

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
                        <button type="button" className={this.state.tabId == "EVENT_STATUS_STARTED" ? "btn btn-dark" : "btn btn-outline-dark"} onClick={() => this.setState({ tabId: "EVENT_STATUS_STARTED" })}>LIVE</button>
                        <button type="button" className={this.state.tabId == "EVENT_STATUS_FINISHED" ? "btn btn-dark" : "btn btn-outline-dark"} onClick={() => this.setState({ tabId: "EVENT_STATUS_FINISHED" })}>FINISHED</button>
                        <button type="button" className={this.state.tabId == "EVENT_STATUS_SCHEDULED" ? "btn btn-dark" : "btn btn-outline-dark"} onClick={() => this.setState({ tabId: "EVENT_STATUS_SCHEDULED" })}>SCHEDULE</button>

                    </div>
                </div>
                <div class="input-group container" style={{
                    marginTop:20
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search"onChange={this.onFilter}/>
            <div   style={{
          marginLeft:20,
          
      }}
>
           <Select
    onChange={(e)=>this.onSelect(e.value)}
      placeholder="Country"
        options={this.state.options}
      />
           </div>
           
   
    
     </div>
                <div className='mt-5'>
                    {tableContent}
                </div>
            </SidebarTemplate>
        );
    }
}

Fifa.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Fifa);
