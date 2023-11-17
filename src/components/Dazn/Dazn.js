import React, { Component } from "react";
import SidebarTemplate from "../common/SidebarTemplate/SidebarTemplate";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import "./Dazn.css";
import { connect } from "react-redux";
import {
  getStudents,
  setMessage,
  deleteStudent,
} from "../../actions/studentActions";
import XMLParser from 'react-xml-parser';
import { getElevenSportDta } from "../../api/api";
import { copy } from "../../utils/copy";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Select from "react-select";
import Axios from "axios";
import moment from "moment";
import Moment from "moment";
import Slider from "react-slick";
import { extendMoment } from "moment-range";
import ModalLogin from "./ModalLogin";
import { baseurl } from "../../utils/config";
class Dazn extends Component {
  state = {
    feedback_msg: null,
    events: [],
    loading: true,
    temp: [],
    tabId: "LIVE",
    selected: 0,
    slickMonth: null,
    dates: [],
    formatDate: null,
    ipInfo: null,
    token: localStorage.getItem("accessTokenIt"),
    loginModalState: false,
    settings: {
      dots: false,
      infinite: false,
      draggable: true,
      centerMode: false,
      speed: 500,
      slidesToShow: 12,
      slidesToScroll: 5,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1550,
          settings: {
            slidesToShow: 20,
            slidesToScroll: 20,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 20,
            slidesToScroll: 20,
          },
        },
        {
          breakpoint: 970,
          settings: {
            slidesToShow: 20,
            slidesToScroll: 20,
          },
        },
        {
          breakpoint: 670,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
          },
        },
      ],
    },
    labels: [],
    contries: [
      { label: "IT", value: "IT" },
      { label: "DE", value: "DE" },
    ],
    stream: [
      { label: "M3U8", value: "M3U8" },
      { label: "MPD", value: "MPD" },
    ],
  };
  static getDerivedStateFromProps(props, state) {
    if (props.message.msg) {
      return {
        feedback_msg: props.message.msg,
      };
    }
    return null;
  }
  async getById(id) {
    let format = "MPEG-DASH";
    let configg = {
      method: "get",
      url:
        "https://api.playback.indazn.com/v5/Playback?AssetId=" +
        id +
        "&PlayerId=test&DrmType=WIDEVINE&Platform=web&Format=" +
        format +
        "&LanguageCode=en&Model=BROWSER&Secure=true&Latitude=null&Longitude=null&Manufacturer=Microsoft&PlayReadyInitiator=false&MtaLanguageCode=it&AppVersion=9.20.0",
      headers: {
        accept: "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        authorization: "Bearer " + this.state.token,
        "x-age-verification-pin": "0000",
        "x-dazn-device": "a36fef80-47d9-4f69-b5a4-31b3612abb56",
      },
    };
    let configTopass = {
      method: 'post',
      url: this.props.nodeLinks.dazn_it?.key + '/excute',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(configg)
    };
    return Axios(configg);
  }
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].label === obj.Label) {
        return true;
      }
    }
    return false;
  }
  login = async () => {
    const axios = require('axios');

    /*  var data = JSON.stringify({
       Email: this.props.daznLogin.it.email,
       Password: this.props.daznLogin.it.password,
       Platform: "ios",
     }); */
    let dataLogin = await localStorage.getItem('loginData')
    let dataLoginParsed = JSON.parse(dataLogin)
    let data = JSON.stringify({
      "Email": dataLoginParsed?.email ?? "onlinealways@tutamail.com",
      "Password": dataLoginParsed?.password ?? "EasyPassword23@",
      "Platform": "web",
      "DeviceId": "005cc6abf3",
      "ProfilingSessionId": "we6cds1935wvevtmzonel"
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://authentication-prod.ar.indazn.com/v5/SignIn',
      headers: {
        'authority': 'authentication-prod.ar.indazn.com',
        'accept': '*/*',
        'accept-language': 'fr,en-US;q=0.9,en;q=0.8,fr-FR;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'origin': 'https://www.dazn.com',
        'referer': 'https://www.dazn.com/',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'x-dazn-ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 signin/4.34.3.55 hyper/0.14.0 (web; production; tn)'
      },
      data: data
    };




    Axios(config)
      .then(function (response) {
        if (response.data) {
          localStorage.setItem(
            "accessTokenIt",
            "" + response?.data?.AuthToken?.Token
          );
          this.setState({ token: response?.data?.AuthToken?.Token });
        }
      })
      .catch(function (error) { console.log(error) });
  };
  async componentDidUpdate(previousProps, previousState) {
    if (
      previousState.formatDate !== this.state.formatDate ||
      previousState.token !== this.state.token
    ) {
      this.setState({ loading: true });
      let res = await this.getSchedule(this.state.formatDate);
      let ccode = this.state.labels;
      ccode.push({ label: "All", value: "All" });
      let channels = res.data.Tiles;
      await Promise.all(
        channels.map(async (el, i) => {
          try {
            let response = await this.getById(el.AssetId);
            channels[i].urls = response.data.PlaybackDetails;
          } catch (error) {
            console.log(error);
          }
        })
      );
      await Promise.all(
        channels?.map((el, i) => {
          if (!this.containsObject(el, ccode))
            ccode.push({ label: el.Label, value: el.Label });
        })
      );
      this.setState({ labels: [...ccode] });
      let arr = this.state.tabId === "LIVE" ? res.data.Tiles?.filter((el, i) => el.IsLinear === false && el.Type === "Live") : res.data.Tiles?.filter((el, i) => el.IsLinear == false)
      this.setState({ events: arr });
      this.setState({ temp: arr });
      this.setState({ loading: false });
    }
    if (previousState.tabId !== this.state.tabId) {
      if (
        this.state.tabId === "LIVE_KEY" ||
        this.state.tabId === "LIVE" ||
        this.state.tabId === "LINEAR"
      ) {
        try {
          this.setState({ loading: true });
          const format2 = "YYYY-MM-DD";
          var date2 = new Date();
          let day = moment(date2).format(format2);
          let res = await this.getSchedule(day);
          let ccode = this.state.labels;
          ccode.push({ label: "All", value: "All" });
          let channels = res.data.Tiles;
          await Promise.all(
            channels.map(async (el, i) => {
              try {
                let response = await this.getById(el.AssetId);
                channels[i].urls = response.data.PlaybackDetails;
                console.log("hahahahahah", response.data.PlaybackDetails)
                let d1 = response.data.PlaybackDetails[0].ManifestUrl
                let xmlData = await Axios.get(d1)
                let str = xmlData.data.toString()
                let start = str.indexOf("cenc:default_KID")
                let str2 = str?.substring(start)
                let str3 = str2.substring(str2.indexOf('"='), 54)
                str3 = str3.replace('cenc:default_KID=', "").replace('"', "")
                channels[i].kid = str3
                var data = JSON.stringify({
                  "link": str3
                });
                var config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: '1',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data: data
                };
                await Axios.post('http://89.38.131.39:3001/curl', {
                  curl: config
                })
                  .then(async function (response) {
                    let token = localStorage.getItem('accessTokenIt')

                    let p = response.data.pssh.replace('PSSH ', '')
                    channels[i].pssh = p
                    var data = JSON.stringify({
                      "license": channels[i].urls[0].LaUrl,
                      "pssh": p,
                      token: token
                    });
                    var config = {
                      method: 'post',
                      maxBodyLength: Infinity,
                      url: '2',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      data: data
                    };
                    await Axios.post('http://89.38.131.39:3001/curl', {
                      curl: config
                    })
                      .then(function (response) {
                        let parseddata = response.data
                        let key = parseddata.key
                        channels[i].key = key
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } catch (error) {
                console.log(error);
              }
            })
          );
          await Promise.all(
            channels?.map((el, i) => {
              if (!this.containsObject(el, ccode))
                ccode.push({ label: el.Label, value: el.Label });
            })
          );
          if (this.state.tabId === "LINEAR") {
            let data = res.data.Tiles;
            let ccode = [];
            ccode.push({ label: "All", value: "All" });
            await Promise.all(
              data?.map((el, i) => {
                if (!this.containsObject(el, ccode))
                  ccode.push({ label: el.Label, value: el.Label });
              })
            );
            this.setState({ labels: [...ccode] });
            let arr = data?.filter((el, i) => el.IsLinear == true);
            this.setState({ events: arr });
            this.setState({ temp: arr });
            this.setState({ loading: false });
          } else {
            let arr = (this.state.tabId === "LIVE" || this.state.tabId === "LIVE_KEY") ? res.data.Tiles?.filter((el, i) => el.IsLinear === false && el.Type === "Live") : res.data.Tiles?.filter((el, i) => el.IsLinear == false)
            this.setState({ events: arr });
            this.setState({ temp: arr });
            this.setState({ loading: false });
          }
        } catch (error) {
          this.setState({ loading: false });
        }
      }
    }
  }
  getSchedule(date, type) {
    var config = {
      method: "get",
      url:
        "https://epg.discovery.indazn.com/eu/v2/Epg?date=" +
        date +
        "&country=it&languageCode=en&openBrowse=false&timeZoneOffset=60",
      headers: {},
    };
    let configTopass = {
      method: 'post',
      url: this.props.nodeLinks.dazn_it?.key + '/excute',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(config)
    };
    return Axios(config);
  }
  generateKey = async (i) => {
    let el = this.state.events[i]
    try {
      let response = await this.getById(el.AssetId);
      el.urls = response.data.PlaybackDetails;
      console.log("hahahahahah", response.data.PlaybackDetails)
      let d1 = response.data.PlaybackDetails[0].ManifestUrl
      let xmlData = await Axios.get(d1)
      let str = xmlData.data.toString()
      let start = str.indexOf("cenc:default_KID")
      let str2 = str?.substring(start)
      let str3 = str2.substring(str2.indexOf('"='), 54)
      str3 = str3.replace('cenc:default_KID=', "").replace('"', "")
      el.kid = str3
      var data = JSON.stringify({
        "link": str3
      });
      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '1',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      await Promise.all(await Axios.post('http://89.38.131.39:3001/curl', {
        curl: config
      })
        .then(async function (response) {
          let token = localStorage.getItem('accessTokenIt')
          let p = response.data.pssh.replace('PSSH ', '')
          el.pssh = p
          var data = JSON.stringify({
            "license": el.urls[0].LaUrl,
            "pssh": p,
            token: token
          });
          var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '2',
            headers: {
              'Content-Type': 'application/json'
            },
            data: data
          };
          await Axios.post('http://89.38.131.39:3001/curl', {
            curl: config
          })
            .then(function (response) {
              let parseddata = response.data
              let key = parseddata.key
              el.key = key
              let channels = this.state.e
            })
            .catch(function (error) {
              console.log(error);
            });
        })

      )
        .catch(function (error) {
          console.log(error);
        });

      let ch = this.state.events
      ch[i] = el
      this.setState({ events: ch })
    } catch (error) {
      await this.login()
      console.log(error);

    }


  }
  async componentDidMount() {
    try {
      this.setState({ loading: true });
      await this.login()
      const format2 = "YYYY-MM-DD";
      const format3 = "YYYY-MM-DDTHH:mm:ss";
      var date2 = new Date();
      let day = moment(date2).format(format2);
      let day2 = moment(date2).format(format3);
      let res = await this.getSchedule(day);
      let dates = this.generateDates(day2);
      this.setState({ slickMonth: dates[0].month });
      this.setState({ dates: dates });
      let ccode = this.state.labels;
      ccode.push({ label: "All", value: "All" });
      let channels = res.data.Tiles;
      await Promise.all(
        channels.map(async (el, i) => {
          try {
            let token = localStorage.getItem('accessTokenIt')
            let response = await this.getById(el.AssetId).catch(err => console.log('not found', err, el.Title, el.AssetId));
            channels[i].urls = response.data.PlaybackDetails;
            console.log("hahahahahah", response.data.PlaybackDetails)
            let d1 = response.data.PlaybackDetails[0].ManifestUrl
            let xmlData = await Axios.get(d1)
            let str = xmlData.data.toString()
            let start = str.indexOf("cenc:default_KID")
            let str2 = str?.substring(start)
            let str3 = str2.substring(str2.indexOf('"='), 54)
            str3 = str3.replace('cenc:default_KID=', "").replace('"', "")
            channels[i].kid = str3
            var data = JSON.stringify({
              "link": str3
            });
            var config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: '1',
              headers: {
                'Content-Type': 'application/json'
              },
              data: data
            };
            await Promise.all(
              await Axios.post('http://89.38.131.39:3001/curl', {
                curl: config
              })
                .then(async function (response) {
                  let p = response.data.pssh.replace('PSSH ', '')
                  console.log("Strem v" + i, p)
                  channels[i].pssh = p
                  var data = JSON.stringify({
                    "license": channels[i].urls[0].LaUrl,
                    "pssh": p,
                    token: token
                  });
                  var config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: '2',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    data: data
                  };
                  await Axios.post('http://89.38.131.39:3001/curl', {
                    curl: config
                  })
                    .then(function (response) {
                      let parseddata = response.data
                      let key = parseddata.key
                      channels[i].key = key
                    })
                    .catch(function (error) {
                      console.log('error ' + error);
                    });
                }))
              .catch(function (error) {
                console.log('error ' + error);
              });
          } catch (error) {

            console.log('error ' + error);
          }
        })
      );
      await Promise.all(
        channels?.map((el, i) => {
          if (!this.containsObject(el, ccode))
            ccode.push({ label: el.Label, value: el.Label });
        })
      );
      this.setState({ labels: [...ccode] });
      let arr = res.data.Tiles?.filter((el, i) => el.IsLinear === false && el.Type === "Live");
      console.log(arr)
      this.setState({ events: arr });
      this.setState({ temp: arr });
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  }
  onSelect(key) {
    if (key == "All") {
      this.setState({ events: this.state.temp });
    } else {
      let data = this.state.temp;
      var filteredArray = data.filter(function (el) {
        return el.Label.toUpperCase().indexOf(key.toUpperCase()) > -1;
      });
      this.setState({ events: filteredArray });
    }
  }
  componentWillUnmount() {
    this.props.setMessage(null);
  }
  searchStudent = (stage) => {
    const searchData = {
      stage: stage,
    };
    this.props.getStudents(searchData);
  };
  addStudent = () => {
    this.props.history.push("/add-student");
  };
  onUpdateStudent = (student_id) => {
    this.props.history.push(`update-student/${student_id}`);
  };
  onDeleteStudent = (student_id, student_stage) => {
    if (window.confirm("Are You Sure ?")) {
      this.props.deleteStudent(student_id, student_stage);
    }
  };
  onFilter = (e) => {
    let key = e.target.value;
    if (key == "") {
      this.setState({ events: this.state.temp });
    } else {
      let data = this.state.temp;
      //("ddddddd", data);
      var filteredArray = data.filter(function (el) {
        return el.Title.toUpperCase().indexOf(key.toUpperCase()) > -1;
      });
      this.setState({ events: filteredArray });
    }
  };
  generateDates(date) {
    const moment = extendMoment(Moment);
    const dates = [];
    const dateRange = moment.range(
      moment(date, "YYYY-MM-DDTHH:mm:ss"),
      moment(date, "YYYY-MM-DDTHH:mm:ss").add(1, "M")
    );
    for (let date of dateRange.by("day")) {
      const weekDay = date.format("ddd").replace(".", "").trim().toUpperCase();
      const month = date.format("MMMM");
      let formatDate = date.format("YYYY-MM-DD");
      date = date.format("DD");
      dates.push({
        date,
        weekDay,
        month,
        formatDate,
      });
    }
    return dates;
  }
  render() {
    let slickMonth = this.state.slickMonth;
    let dates = this.state.dates;
    let settings = {
      dots: false,
      infinite: false,
      draggable: true,
      centerMode: false,
      speed: 500,
      slidesToShow: 12,
      slidesToScroll: 5,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1550,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
          },
        },
        {
          breakpoint: 970,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 7,
          },
        },
        {
          breakpoint: 670,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
          },
        },
      ],
    };
    const { loading } = this.state;
    let students = ["", "", ""];
    let tableContent;
    if (loading) {
      tableContent = (
        <div className="text-center">
          <Spinner />
        </div>
      );
    } else if (loading === false && students === null) {
      tableContent = (
        <h1 className="display-4 text-danger">No data Found :(</h1>
      );
    } else {
      let studentsTable = this.state.events.map((itemData, index) => {
        let toAdd = this.state.tabId === "LIVE_KEY";
        return (
          <tr key={itemData.AssetId}>
            <td><i class="fa fa-check" style={{
              color: itemData?.key ? "green" : "red",
              fontSize: 25
            }}></i> </td>
            <td>{itemData.Title} </td>
            <td>{itemData.Description}</td>
            <td>{itemData.Type}</td>
            <td>{itemData.Label}</td>
            {/* <td>
              {itemData?.urls?.length > 0 && (
                <button
                  style={{ backgroundColor: "red" }}
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(
                      itemData?.pssh
                    )
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              )}
            </td><td>
              {itemData?.urls?.length > 0 && (
                <button
                  style={{ backgroundColor: "blue" }}
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(
                      itemData?.urls[0]?.LaUrl
                    )
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              )}
            </td> */}
            <td>{moment(itemData.Start).format("HH:MM")}</td>
            <td>{moment(itemData.End).format("HH:MM")}</td>
            <td>
              {itemData?.urls?.length > 0 && (
                <button
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(
                      itemData?.key ? itemData?.urls[0]?.ManifestUrl + "&decryption_key=" + itemData?.key : itemData?.urls[0]?.ManifestUrl + "&decryption_key=0d6712bf2a84edcc93d001a9613f6fec"
                    )
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              )}
            </td>
            <td>
              {itemData?.urls?.length > 1 && (
                <button
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(
                      itemData?.key ? itemData?.urls[1]?.ManifestUrl + "&decryption_key=" + itemData?.key : itemData?.urls[1]?.ManifestUrl + "&decryption_key=0d6712bf2a84edcc93d001a9613f6fec"
                    )
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              )}
            </td>
            <td>
              {itemData?.urls?.length > 2 && (
                <button
                  className="btn btn-secondary btn-sm mr-1"
                  onClick={() =>
                    copy(
                      itemData?.key ? itemData?.urls[2]?.ManifestUrl + "&decryption_key=" + itemData?.key : itemData?.urls[2]?.ManifestUrl + "&decryption_key=0d6712bf2a84edcc93d001a9613f6fec"
                    )
                  }
                >
                  <i class="fa fa-copy"></i>
                </button>
              )}
            </td>

          </tr>
        );
      });
      tableContent = (
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col" style={{ paddingRight: 50, flexDirection: 'row' }}>  <i class="fa fa-key"></i></th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Type</th>
              <th scope="col">Label</th>
              {/*  <th scope="col" style={{ color: "red" }}>PSSH</th>
              <th scope="col" style={{ color: "blue" }}>LICENCE</th> */}
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">LINK 1</th>
              <th scope="col">LINK 2</th>
              <th scope="col">LINK 3</th>
            </tr>
          </thead>
          <tbody>{studentsTable}</tbody>
        </table>
      );
    }
    return (
      <SidebarTemplate>
        { }
        {this.state.feedback_msg ? (
          <div
            className={`alert alert-${this.state.feedback_msg.type} alert-dismissible fade show mt-3`}
            role="alert"
          >
            <strong>{this.state.feedback_msg.content}</strong>
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : null}
        { }
        { }
        <div className="text-center mt-3">
          <div className="btn-group" role="group">

            <button
              type="button"
              className={
                this.state.tabId == "LIVE"
                  ? "btn btn-light"
                  : "btn btn-outline-light"
              }
              onClick={() => this.setState({ tabId: "LIVE" })}
            >
              LIVE
            </button>
            <button
              type="button"
              className={
                this.state.tabId == "LINEAR"
                  ? "btn btn-light"
                  : "btn btn-outline-light"
              }
              onClick={() => this.setState({ tabId: "LINEAR" })}
            >
              LINEAR
            </button>
            <button
              type="button"
              className={
                this.state.tabId == "SCHEDULE"
                  ? "btn btn-light"
                  : "btn btn-outline-light"
              }
              onClick={() => this.setState({ tabId: "SCHEDULE" })}
            >
              SCHEDULE
            </button>
          </div>
          {this.props?.isAdmin && <button
            className="btn btn-warning float-right"
            onClick={() => this.setState({ loginModalState: true })}
          >
            NEW LOGIN
          </button>}
        </div>
        <div
          class="input-group container"
          style={{
            marginTop: 20,
          }}
        >
          <input
            class="form-control border-end-0 border rounded-pill"
            type="text"
            id="example-search-input"
            placeholder="Search"
            onChange={this.onFilter}
          />
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <Select
              onChange={(e) => this.onSelect(e.value)}
              placeholder="Label"
              options={this.state.labels}
            />
          </div>
          {/*  <div   style={{
          marginLeft:20,
      }}
>
           <Select
    onChange={(e)=>this.onSelect(e.value)}
      placeholder="Country code"
        options={this.state.contries}
      />
           </div> */}
          {/* <div   style={{
          marginLeft:20,
      }}
>
           <Select
    onChange={(e)=>this.onSelect(e.value)}
      placeholder="Stream type"
        options={this.state.stream}
      />
           </div> */}
        </div>
        {this.state.tabId == "SCHEDULE" && (
          <div
          >
            <div
            >
              <h3
                className="date-scroller__month-title"
                style={{
                  marginTop: 10,
                  color: 'white'
                }}
              >
                {slickMonth.charAt(0).toUpperCase() + slickMonth.substring(1)}
              </h3>
              {this.state.dates && (
                <Slider {...settings}>
                  {this.state.dates?.map((element, index) => {
                    return (
                      <section key={index} id={`date-${index}`}>
                        <section
                          onClick={() => {
                            this.setState({ slickMonth: dates[index].month });
                            this.setState({ selected: index });
                            this.setState({
                              formatDate: dates[index].formatDate,
                            });
                          }}
                          className="date-scroller__date-tile-wrapper"
                          style={{ width: "100%", display: "inline-block" }}
                        >
                          <section
                            className="date-tile__date-tile "
                            style={{
                              borderRadius: "100%",
                              width: 80,
                              height: 80,
                              backgroundColor:
                                this.state.selected === index
                                  ? "black"
                                  : "transparent",
                            }}
                          >
                            <span className="date-tile__day-of-the-month" style={{
                              color: 'white'
                            }}>
                              {element.date}
                            </span>
                            <span className="date-tile__day-of-the-week" style={{
                              color: 'white'
                            }} >
                              {element.weekDay}
                            </span>
                          </section>
                        </section>
                      </section>
                    );
                  })}
                </Slider>
              )}
            </div>
          </div>
        )}
        {this.state.token ? (
          <div className="mt-5">{tableContent}</div>
        ) : (
          <h4
            style={{
              textAlign: "center",
              margin: 20,
              marginTop: 50,
              color: 'red'
            }}
          >
            You are not connected ! Please Refresh Your Tab
          </h4>
        )}
        {this.state.loginModalState && (
          <ModalLogin
            reload={(token) => this.setState({ token: token })}
            onClose={() => this.setState({ loginModalState: false })}
          ></ModalLogin>
        )}
      </SidebarTemplate>
    );
  }
}
Dazn.propTypes = {
  student: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  getStudents: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  deleteStudent: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  student: state.student,
  message: state.message,
  isAdmin: state.admin.isAdmin
});
export default connect(mapStateToProps, {
  getStudents,
  setMessage,
  deleteStudent,
})(Dazn);
