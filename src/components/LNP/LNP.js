import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { fetchingSerieA, fetchingSerieB, fetchWithIdLNP, getElevenSportDta, getElevenSportDtaFifa, SignInLNP } from '../../api/api';
import { copy } from '../../utils/copy';

class Lnp extends Component {

    state = {
        feedback_msg: null,
        events:[],
        loading:false,
        tabId:"A",
        token:null
    }

    static getDerivedStateFromProps(props, state) {
        if(props.message.msg) {
            return {
                feedback_msg: props.message.msg
            }
        }
        return null;
    }
 async fetchingSerieAData(){
    try {
        let idSerieA=[]
        let videos = []
        let serieAapi = await fetchingSerieA()
        let data = serieAapi.data
        console.log("data",data)
        if(data.modules)
        
       await Promise.all( data.modules.map((el,i)=>{
            let arr =el?.contentData
            if(arr!=null)
            arr.map((el,i)=>{
                idSerieA.push(el?.gist?.id)
            })
        }))
        console.log("ids",idSerieA)
        await Promise.all(idSerieA.map(async (el,i)=>{
        await  fetchWithIdLNP(el,this.state.token).then(res=>{
            if(res.data)
         console.log("resdddddddddd",res.data.video.gist)
            videos.push({...res.data.video.gist,...res.data.video})
           }).catch(err=>console.log(err))
          
        }))
        console.log("resdddddddddd1",videos)
        this.setState({events:videos})
        this.setState({loading:false})
    }
     catch (error) {
        console.log("errrrrrro",error)
    }
    
}
async componentDidUpdate(previousProps, previousState) {
    if (previousState.tabId !== this.state.tabId) {
        this.setState({loading:true})
       if(this.state.tabId=="A"){
        this.fetchingSerieAData()
       }else {
        this.fetchingSerieBData()   
       }
       
       
    }    
}
async fetchingSerieBData(){
    try {
        let idSerieA=[]
        let videos = []
        let serieAapi = await fetchingSerieB()
        let data = serieAapi.data
        console.log("data",data)
        if(data.modules)
        
       await Promise.all( data.modules.map((el,i)=>{
            let arr =el?.contentData
            if(arr!=null)
            arr.map((el,i)=>{
                idSerieA.push(el?.gist?.id)
            })
        }))
        console.log("ids",idSerieA)
        await Promise.all(idSerieA.map(async (el,i)=>{
        await  fetchWithIdLNP(el,this.state.token).then(res=>{
            if(res.data)
         console.log("resdddddddddd",res.data.video.gist)
            videos.push({...res.data.video.gist,...res.data.video})
           }).catch(err=>console.log(err))
          
        }))
        console.log("resdddddddddd1",videos)
        this.setState({events:videos})
        this.setState({loading:false})
    }
     catch (error) {
        console.log("errrrrrro",error)
    }
    

}
async componentDidMount(){
    this.setState({loading:!false})
    let tokenapi = await SignInLNP()
    console.log("********",tokenapi.data)
    if(tokenapi.data.authorizationToken){
       this.setState({token:tokenapi.data.authorizationToken},()=>{
        this.fetchingSerieAData()
       })
    }
    
 
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
            let studentsTable = this.state.events.map((video,i) => {
                let date=""+new Date(video.scheduleStartDate).getDate()+"/"+(new Date(video.scheduleStartDate).getMonth()+1)+"/"+new Date(video.scheduleStartDate).getFullYear()+" "+new Date(video.scheduleStartDate).getHours()+":"+new Date(video.scheduleStartDate).getMinutes()
                let re720=video?.streamingInfo.videoAssets.hls.replace('index',"index_1")
                let re540=video?.streamingInfo.videoAssets.hls.replace('index',"index_2")
                return(
                    <tr key={video.id }>
                         <td>{video.id } </td>
                         <td>{video.title } </td>
                        <td style={{textAlign:"center",justifyContent:"space-between",}}><a href={""+video.videoImageUrl} target="_blank" style={{cursor:"pointer"}}><i class="fa fa-arrow-right " ></i> </a> <i class="fa fa-copy " onClick={()=>copy(""+video.videoImageUrl)} style={{
                            marginLeft:20,
                            cursor:"pointer"
                        }}></i></td>
                        <td>{date}</td>
                        <td>{video.timezone}</td>
                        <td>{video.isLiveStream?"true":'false' }</td>
                      

                       
                     
                       
                      <td>
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(re720)}><i class="fa fa-copy"></i></button>
                           
                        </td>
                       <td>
                            <button className='btn btn-warning btn-sm mr-1' onClick={()=>copy(re540)}><i class="fa fa-copy"></i></button>
                           
                        </td>
                        <td>
                            <button className='btn btn-warning btn-sm mr-1' onClick={()=>copy(video?.streamingInfo.videoAssets.hls)}><i class="fa fa-copy"></i></button>
                           
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
                        <th scope="col">videoImageUrl</th>

                        <th scope="col">scheduleStartDate</th>
                        <th scope="col">timezone</th>
                        <th scope="col">isLiveStream</th>
                    
                        <th scope="col">720p</th>
                        <th scope="col">540p</th>
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
                        <button type="button" className={this.state.tabId=="A"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"A"})}>SERIE A</button>
                        <button type="button" className={this.state.tabId=="B"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"B"})}>SERIE B</button>
                      
                    
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

Lnp.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Lnp);
