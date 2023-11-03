import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta } from '../../api/api';
import { copy } from '../../utils/copy';
import moment from 'moment'
import Axios from 'axios';
class WorldPadel extends Component {
    state = {
        temp:[],
      
        feedback_msg: null,
        events:[],
        loading:false,
        tabId:"LIVE",
        lives:[],
        VOD:[],
        upcoming:[]
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
           if(this.state.tabId==='LIVE'){
            this.setState({events:[]},()=>{
                const uniqueIds = [];
                const unique = this.state.lives.filter(element => {
                    const isDuplicate = uniqueIds.includes(element.id);
                  
                    if (!isDuplicate) {
                      uniqueIds.push(element.id);
                  
                      return true;
                    }
                  
                    return false;
                  });
                  
                this.setState({events:[...unique]})
            })
               
           }
           else if(this.state.tabId==='VOD'){
            this.setState({events:[]},()=>{
                const uniqueIds = [];
                const unique = this.state.vods?.filter(element => {
                    const isDuplicate = uniqueIds.includes(element.id);
                  
                    if (!isDuplicate) {
                      uniqueIds.push(element.id);
                  
                      return true;
                    }
                  
                    return false;
                  });
                  
                this.setState({events:[...unique]})
            })
           
        }
       else if(this.state.tabId==='UPCOMING'){
        this.setState({events:[]},()=>{
            const uniqueIds = [];
            const unique = this.state.upcoming?.filter(element => {
                const isDuplicate = uniqueIds?.includes(element.id);
              
                if (!isDuplicate) {
                  uniqueIds.push(element.id);
              
                  return true;
                }
              
                return false;
              });
              
            this.setState({events:[...unique]})
        })
            
        }
        } 
    }
    async componentDidMount() {
        this.setState({loading:true})
       // var axios = require('axios');
       //var axios = require('axios');

       var configlogin = {
         method: 'get',
         url: 'https://wpt-identity.llt-services.com/api/token?platformId=e1e1a7b1-b8f7-4c47-8213-c59e04a03023',
         headers: { 
           'authority': 'wpt-identity.llt-services.com', 
           'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"', 
           'accept': 'application/json, text/plain, */*', 
           'x-app-id': '14e811e1-e8dd-4f0a-b4d8-98fdc285e864', 
           'x-tenant-id': '5d42d437-88ba-42e8-927b-464fd45efe30', 
           'sec-ch-ua-mobile': '?0', 
           'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36', 
           'sec-ch-ua-platform': '"Windows"', 
           'origin': 'https://www.worldpadeltourtv.com', 
           'sec-fetch-site': 'cross-site', 
           'sec-fetch-mode': 'cors', 
           'sec-fetch-dest': 'empty', 
           'referer': 'https://www.worldpadeltourtv.com/', 
           'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
         }
       };
       
      let re= await  Axios(configlogin)
    let access_token= re.data.access_token
       
        var config = {
          method: 'get',
          url: 'https://wpt-backend.llt-services.com/api/pages/6f566577-a6eb-4326-98b4-08d9a9a9a98f/videos',
          headers: { 
            'authority': 'wpt-backend.llt-services.com', 
            'accept': 'application/json, text/plain, */*', 
            'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7', 
            'authorization': 'Bearer '+access_token,
            'referer': 'https://www.worldpadeltourtv.com/', 
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"', 
            
            'x-app-id': '14e811e1-e8dd-4f0a-b4d8-98fdc285e864', 
            'x-language-code': 'es', 
            'x-platform': 'ZTFlMWE3YjEtYjhmNy00YzQ3LTgyMTMtYzU5ZTA0YTAzMDIz', 
            'x-tenant-id': '5d42d437-88ba-42e8-927b-464fd45efe30'
          }
        };
        
       let response =  await Axios(config)
       let data= response.data.page.subPages
       let lives =[]
       let VOD =[]
       let upcoming=[]
      await Promise.all( data.map((el,i)=>{
           let pageItems= el?.items
           console.log(pageItems)
pageItems.map((video,i)=>{
    if(video.videoType==="LIVE"&&moment(video.airDate).isBefore(moment())){
        lives.push(video)
    }
    else if(video.videoType==="LIVE"&&moment(video.airDate).isAfter(moment())){
        upcoming.push(video)
    }
    else if(video.videoType==="VOD"){
        VOD.push(video)
    }
})
       }))
       this.setState({lives:lives})
       this.setState({vods:VOD})
       this.setState({upcoming:upcoming})
       const uniqueIds = [];
                const unique = lives.filter(element => {
                    const isDuplicate = uniqueIds.includes(element.id);
                  
                    if (!isDuplicate) {
                      uniqueIds.push(element.id);
                  
                      return true;
                    }
                  
                    return false;
                  });
                  
                this.setState({events:[...unique]})
        this.setState({events:unique})
       
         this.setState({loading:false})
        
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
          
          this.setState({events:this.state.temp})
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
            let studentsTable = this.state.events.map(itemData => {
             
              
                return(
                    <tr key={itemData.id }>
                          <td >{itemData.title } </td>
                          <td >{itemData.title } </td>
                          <td >{itemData.videoType } </td>
                          <td >{moment(itemData.airDate).format('YY-MM-DD HH:MM') } </td>
                       

                       
                     
                       
                      <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(itemData.uris.sources.hls)}><i class="fa fa-copy"></i></button>
                           
                        </td>
                       
                    </tr>
                );
            });

            tableContent = (
                <table className="table table-striped table-sm">
                  <thead >
                        <tr>
                        <th scope="col">Title</th>
                        <th scope="col">description</th>
                        <th scope="col">VideoType</th>
                        <th scope="col">Air Date</th>
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
                        <button type="button" className={this.state.tabId=="LIVE"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"LIVE"})}>LIVE</button>
                        <button type="button" className={this.state.tabId=="UPCOMING"?"btn btn-dark":"btn btn-outline-dark"} onClick={() => this.setState({tabId:"UPCOMING"})}>UPCOMING</button>
                        <button type="button" className={this.state.tabId=="VOD"?"btn btn-dark":"btn btn-outline-dark"}  onClick={() => this.setState({tabId:"VOD"})}>VOD</button>
                    
                    </div>
                    </div>
             <div class="input-group container" style={{
                    marginTop:20
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" onChange={this.onFilter} />
           
     </div>
                <div className='mt-5'>
                  {tableContent}
                </div>
            </SidebarTemplate>
        );
    }
}

WorldPadel.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(WorldPadel);
