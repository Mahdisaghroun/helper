import React, { Component } from 'react'
import SidebarTemplate from '../common/SidebarTemplate/SidebarTemplate';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStudents, setMessage, deleteStudent } from '../../actions/studentActions';
import { getElevenSportDta, getElevenSportDtaItalia, getElevenSportDtaItaliaLive, getElevenSportDtaItaliaLiveById } from '../../api/api';
import { copy } from '../../utils/copy';
import Select from 'react-select';
import Axios from 'axios';
class Italia extends Component {

    state = {
        feedback_msg: null,
        events: [],
        loading: true,
        tabId: "EVENT_STATUS_STARTED"
    }

    static getDerivedStateFromProps(props, state) {
        if (props.message.msg) {
            return {
                feedback_msg: props.message.msg
            }
        }
        return null;
    }
    async componentDidUpdate(previousProps, previousState) {
        if (previousState.tabId !== this.state.tabId) {
            this.setState({ loading: true })

            let res = this.state.tabId == "EVENT_STATUS_STARTED" ? getElevenSportDtaItaliaLive() : await getElevenSportDtaItalia(this.state.tabId)

            console.log(res.data)
            let channels = res.data.events
            let ccode = [{ label: "All competition name", value: "All competition name" }]
            await Promise.all(channels?.map((el, i) => {

                if (!this.containsObject(el, ccode))
                    ccode.push({ label: el.metadata.competition_name, value: el.metadata.competition_name })
                //if (!this.containsObject(el, "Final Eight Coppa Italia Lega Basket Serie A"))
                // this.createFileSerieC(el)
            }))
            console.log(ccode)
            this.setState({ options: [...ccode] })
            this.setState({ events: channels })
            this.setState({ temp: channels })
            this.setState({ loading: false })
        }
    }
    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].label === obj.metadata.competition_name) {
                console.log("t")
                return true;
            }
        }

        return false;
    }
    async componentDidMount() {
        this.setState({ loading: true })
        let res = this.state.tabId == "EVENT_STATUS_STARTED" ? await getElevenSportDtaItaliaLive(this.props.nodeLinks?.eleven_sport_italia.key) : await getElevenSportDtaItalia(this.state.tabId)
        console.log("zzzzzzzz", res.data)

        let channels = res.data.events
        let ccode = [{ label: "All competition name", value: "All competition name" }]
        await Promise.all(channels?.map(async (el, i) => {
            let responseId = await getElevenSportDtaItaliaLiveById(el.id, this.props.nodeLinks?.eleven_sport_italia.key)
            let url = responseId.data?.url
            el.freshurl = url
            if (!this.containsObject(el, ccode))
                ccode.push({ label: el.metadata.competition_name, value: el.metadata.competition_name })
            // if (!this.containsObject(el, "Serie C - Girone C"))
            //this.createFileSerieC(el)
            //ccode.push({ label: el.metadata.competition_name, value: el.metadata.competition_name })
        }))

        console.log(ccode)
        this.setState({ options: [...ccode] })
        console.log("channels", channels)
        this.setState({ events: channels })
        this.setState({ temp: channels })
        this.setState({ loading: false })
        /*   const searchData = {
              stage: 'primary'
          }
          this.props.getStudents(searchData); */
    }
    async createFileSerieC(el) {
        let txt = this.state.tabId !== "EVENT_STATUS_SCHEDULED" && el.metadata?.mcls_internal_data ? el.metadata?.mcls_internal_data[0]?.value.replace('master', "720p/playlist") : ''
        fetch(txt).then(res => res.text().then(final => {
            console.log("final", final)
            let pre = el.title.replace(" ", "")
            let file1 = "'" + pre?.split('vs')[0] + "'" + ".m3u8"
            file1 = file1.replace(" ", "")
            file1 = file1.toLowerCase()
            let file2 = "'" + el.title?.split('vs')[1] + "'" + ".m3u8"
            file2 = file2.replace(" ", "")
            file2 = file2.toLowerCase()
            console.log('file2', file2)


            // let tt = final.replace(/(\r\n|\n|\r)/gm, "\\");
            // console.log(tt)
            var data = JSON.stringify({
                "cmd": "cd /home/xtreamcodes/iptv_xtream_codes/wwwdir/lba && echo '" + final + "' >> " + file1
            });
            var data2 = JSON.stringify({
                "cmd": "cd /home/xtreamcodes/iptv_xtream_codes/wwwdir/lba && echo '" + final + "' >> " + file2
            });

            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://45.86.190.104:5100/excute',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': 'http://localhost:3000/',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                    'Content-Type': 'application/json'
                },
                data: data
            };
            var config2 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://45.86.190.104:5100/excute',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': 'http://localhost:3000/',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                    'Content-Type': 'application/json'
                },
                data: data2
            };

            Axios(config)
                .then(function (response) {
                    Axios(config2)
                        .then(function (response) {
                            console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }))


    }
    componentWillUnmount() {
        this.props.setMessage(null);
    }
    onSelect(key) {

        if (key == "All competition name") {

            this.componentDidMount()
        }


        else {

            let data = this.state.temp


            var filteredArray = data.filter(function (el) {
                return el.metadata.competition_name.toUpperCase().indexOf(key.toUpperCase()) > -1;
            });
            this.setState({ events: filteredArray })
        }
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
    onFilter = (e) => {

        let key = e.target.value
        if (key == "") {

            this.componentDidMount()
        }


        else {

            let data = this.state.events
            console.log("ddddddd", data)
            console.log(key)
            var filteredArray = data.filter(function (el) {
                return el.title.toUpperCase().indexOf(key.toUpperCase()) > -1;
            });
            this.setState({ events: filteredArray })
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
                        <td >

                            {itemData.freshurl?.indexOf("wv")>-1&&<div style={{
                                backgroundColor: "green",
                                width: 10,
                                height: 10,
                                borderRadius: 20,
                            }}></div>}
                        </td>
                        <td >{itemData.id} </td>
                        <td >{itemData.title} </td>
                        <td >{itemData.location.physical.country_code}</td>
                        <td >{itemData.metadata.competition_name}</td>
                        <td >{itemData.start_time}</td>
                        <td >{itemData.status}</td>




                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(itemData.freshurl)}><i class="fa fa-copy"></i></button>

                        </td>}
                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(itemData.freshurl)}><i class="fa fa-copy"></i></button>

                        </td>}
                        {this.state.tabId !== "EVENT_STATUS_SCHEDULED" && <td >
                            <button className='btn btn-success btn-sm mr-1' onClick={() => copy(itemData.freshurl)}><i class="fa fa-copy"></i></button>

                        </td>}
                    </tr>
                );
            });

            tableContent = (
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                        <th scope="col">WV</th>
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
                    marginTop: 20
                }} >
                    <input class="form-control border-end-0 border rounded-pill" type="text" id="example-search-input" placeholder="Search" onChange={this.onFilter} />
                    <div style={{
                        marginLeft: 20,

                    }}
                    >
                        <Select
                            onChange={(e) => this.onSelect(e.value)}
                            placeholder="Competition Name"
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

Italia.propTypes = {
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

export default connect(mapStateToProps, { getStudents, setMessage, deleteStudent })(Italia);
