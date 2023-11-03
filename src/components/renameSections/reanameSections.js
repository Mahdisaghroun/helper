import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta } from '../../api/api';
import { copy } from '../../utils/copy';

import 'react-confirm-alert/src/react-confirm-alert.css';
class Schedule extends Component {

    state = {
        feedback_msg: null,
        events:[],
        loading:true,
        tabId:"EVENT_STATUS_STARTED",
        action:1,
        data:[]
    }
async onChange(){
localStorage.setItem('sections',JSON.stringify(this.state.data))
alert('Update Done')
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
      let data =localStorage.getItem('sections')
      if(data)
      this.setState({data:JSON.parse(data)})
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

         <h1>Change main sections name</h1>
               
          <div className='mt-5'>
                <div class="row clearfix">
		<div class="col-md-12 column">
			<table class="table table-bordered table-hover" id="tab_logic">
				<thead>
					<tr>
						
						<th class="text-center">
							SCHEDULE
						</th>
						<th class="text-center">
							ELEVEN SPORT
						</th>
                        <th class="text-center">
                        ELEVEN SPORT
						</th>
						<th class="text-center">
                       FIFA+WORLD
						</th>
                        <th class="text-center">
							F1 PASS
						</th>
						<th class="text-center">
							LNP BASKET 
						</th>
                        <th class="text-center">
							VOLLEY
						</th>
                        <th class="text-center">
							DISCOVERY+
						</th>
                        <th class="text-center">
							RAI
						</th>
                        <th class="text-center">
							SERIE A
						</th>
                        <th class="text-center">
							MEDIASET
						</th>
                        <th class="text-center">
							DAZN IT
						</th>
                        <th class="text-center">
							DAZN DE
						</th>
                        <th class="text-center">
							DAZN ES
						</th>
                        <th class="text-center">
							WORLD PADEL TOUR
						</th>

						
					</tr>
				</thead>
				<tbody>
					<tr id='addr0'>
						
						<td>
						<input type="text" name='name[]'   class="form-control" value={this.state.data[0]} onChange={(e)=>{
                            let data = this.state.data
                            data[0]=e.target.value
                            this.setState({data:data})
                        }}/>
						</td>
						<td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[1]}
                        onChange={(e)=>{
                            let data = this.state.data
                            data[1]=e.target.value
                            this.setState({data:data})
                        }}
                        />
						</td>
                        <td>
						<input type="text" name='name[]'   class="form-control"value={this.state.data[2]} onChange={(e)=>{
                            let data = this.state.data
                            data[2]=e.target.value
                            this.setState({data:data})
                        }}/>
						</td>
						<td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[3]}
                        onChange={(e)=>{
                            let data = this.state.data
                            data[3]=e.target.value
                            this.setState({data:data})
                        }}
                        />
						</td>
						
                        <td>
						<input type="text" name='name[]'   class="form-control" value={this.state.data[4]} onChange={(e)=>{
                            let data = this.state.data
                            data[4]=e.target.value
                            this.setState({data:data})
                        }}/>
						</td>
						<td>
						<input type="email" name='mail[]'  class="form-control"value={this.state.data[5]}
                       onChange={(e)=>{
                        let data = this.state.data
                        data[5]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[6]}
                       onChange={(e)=>{
                        let data = this.state.data
                        data[6]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[7]}
                       onChange={(e)=>{
                        let data = this.state.data
                        data[7]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[8]}
                        onChange={(e)=>{
                            let data = this.state.data
                            data[8]=e.target.value
                            this.setState({data:data})
                        }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[9]}
                        onChange={(e)=>{
                            let data = this.state.data
                            data[9]=e.target.value
                            this.setState({data:data})
                        }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[10]}
                      onChange={(e)=>{
                        let data = this.state.data
                        data[10]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[10]}
                      onChange={(e)=>{
                        let data = this.state.data
                        data[11]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[10]}
                      onChange={(e)=>{
                        let data = this.state.data
                        data[12]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[10]}
                      onChange={(e)=>{
                        let data = this.state.data
                        data[13]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                        <td>
						<input type="email" name='mail[]'  class="form-control" value={this.state.data[15]}
                      onChange={(e)=>{
                        let data = this.state.data
                        data[15]=e.target.value
                        this.setState({data:data})
                    }}
                        />
						</td>
                       
						
					</tr>
                    
				</tbody>
              
                  
                
			</table>
            <button className='btn btn-success text-center' type='button' onClick={()=>this.onChange()}>Update</button>
		</div>
	</div>
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
