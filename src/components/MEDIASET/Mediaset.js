import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta } from '../../api/api';
import { copy } from '../../utils/copy';

class Mediaset extends Component {
    state = {
        temp:[
            { key:"Italia 1",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(i1)/index.m3u8"},
             
            { key :"Canale 5",
             value:"https://live2t.msf.cdn.mediaset.net/content/hls_h0_cls_vos/live/channel(c5)/index.m3u8"},
             
            { key:"Rete 4",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(r4)/index.m3u8"},
             
            { key:"Grande Fratello Regia 1",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b7)/index.m3u8"},
             
            { key:"Grande Fratello Regia 2",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b8)/index.m3u8"},
             
             {key:"Grande Fratello +1",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b9)/index.m3u8"},
             
            { key:"Canale 20",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(lb)/index.m3u8"},
             
             {key:"Iris",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ki)/index.m3u8"},
             
            {key: "Canele 27",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ts)/index.m3u8"},
             
            { key:"La 5",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ka)/index.m3u8"},
             
             {key:"Cine 34",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b6)/index.m3u8"},
             
             {key:"Focus",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(fu)/index.m3u8"},
             
            { key:"TopCrime",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(lt)/index.m3u8"},
             
            { key:"Italia 2",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(i2)/index.m3u8"},
             
             {key:"Tgcom24",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kf)/index.m3u8"},
             
             {key:"Mediaset Extra",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kq)/index.m3u8"},
             
            { key:"Boing",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kb)/index.m3u8"},
             
            { key:"Cartoonito",
             value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(la)/index.m3u8"}
 
         ],
      
        feedback_msg: null,
        events:[
           { key:"Italia 1",
           value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(i1)/index.m3u8"},
            
           { key :"Canale 5",
            value:"https://live2t.msf.cdn.mediaset.net/content/hls_h0_cls_vos/live/channel(c5)/index.m3u8"},
            
           { key:"Rete 4",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(r4)/index.m3u8"},
            
           { key:"Grande Fratello Regia 1",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b7)/index.m3u8"},
            
           { key:"Grande Fratello Regia 2",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b8)/index.m3u8"},
            
            {key:"Grande Fratello +1",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b9)/index.m3u8"},
            
           { key:"Canale 20",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(lb)/index.m3u8"},
            
            {key:"Iris",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ki)/index.m3u8"},
            
           {key: "Canele 27",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ts)/index.m3u8"},
            
           { key:"La 5",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(ka)/index.m3u8"},
            
            {key:"Cine 34",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(b6)/index.m3u8"},
            
            {key:"Focus",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(fu)/index.m3u8"},
            
           { key:"TopCrime",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(lt)/index.m3u8"},
            
           { key:"Italia 2",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(i2)/index.m3u8"},
            
            {key:"Tgcom24",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kf)/index.m3u8"},
            
            {key:"Mediaset Extra",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kq)/index.m3u8"},
            
           { key:"Boing",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(kb)/index.m3u8"},
            
           { key:"Cartoonito",
            value:"https://live2.msf.cdn.mediaset.net/content/hls_h0_clr_vos/live/channel(la)/index.m3u8"}

        ],
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
             
                let re720=this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&itemData.metadata?.mcls_internal_data?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"720p/playlist"):''
                let re1080=this.state.tabId!=="EVENT_STATUS_SCHEDULED"&&itemData.metadata?.mcls_internal_data?itemData.metadata?.mcls_internal_data[0]?.value.replace('master',"1080p/playlist"):''
                return(
                    <tr key={itemData.key }>
                          <td >{itemData.key } </td>
                       

                       
                     
                       
                      <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={()=>copy(itemData.value)}><i class="fa fa-copy"></i></button>
                           
                        </td>
                       
                    </tr>
                );
            });

            tableContent = (
                <table className="table table-striped table-sm">
                  <thead >
                        <tr>
                        <th scope="col">Title</th>
                      
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

Mediaset.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Mediaset);
