import Axios from "axios";
import React, { useState } from "react";
import { baseurl } from "../../utils/config";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import { useEffect } from "react";
export default function CheckItem(props) {
  const [isWork, setisWork] = useState(false);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    async function checkWorking() {
      try {
        setisWork(false);
        let res = await Axios.get(props.ip);
        //  console.log(res)
        if (res.status == 200 || res.status == 500) {
          setloading(false);
          setisWork(true);
        } else {
          setloading(false);
          setisWork(false);
        }
      } catch (error) {
        setloading(false);
        setisWork(false);
      }
    }
    try {
      checkWorking();
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  }, []);
  const deleteEvent = (key) => {
    var data = JSON.stringify({
      key: key,
    });

    var config = {
      method: "delete",
      url: baseurl + "/deleteEvent",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    Axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        props.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const Active=(cmdd)=>{
  console.log(cmdd)
    var data = {
      cmd: ""+cmdd
    };
    
    var config = {
      method: 'post',
      url: 'http://185.221.173.62:4500/start',
      headers: { 
       
      },
      data : data
    };
    
    Axios(config)
    .then(function (response) {
     alert('Start Ok')
     props.reload()
    })
    .catch(function (error) {
      alert('Error')
    });
    
  }
  const Disable=(port)=>{
  console.log(port)
 
    var data = {
      port:port
    };
    
    var config = {
      method: 'post',
      url: 'http://185.221.173.62:4500/kill',
      headers: { 
       
      },
      data : data
    };
    
    Axios(config)
    .then(function (response) {
      props.reload()
     alert('Kill Ok')
    })
    .catch(function (error) {
      alert('Error')
    });
    
  }
  const submit = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this section.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteEvent(id),
          className: "btn btn-danger",
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div
      class="col-sm-2"
      style={{
        margin: 10,
      }}
    >
      <div
        class="card "
        style={{
          borderRadius: 8,

          height: 180,
          paddingRight: 10,
          paddingLeft: 10,

          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <h6 class="text-center" style={{}}>
          {props.title}{" "}
        </h6>
        <p
          class="text-center"
          style={{
            fontSize: 12,
          }}
        >
          {props.ip}{" "}
        </p>

        <a
          target="_blank"
          style={{
            color: "red",
            marginTop: 20,
            cursor: "pointer",
          }}
          class="text-center danger"
        >
          {isWork && !loading ? (
            <i
              class="fa fa-check-square"
              style={{
                fontSize: 30,
                color: "green",
              }}
              aria-hidden="true"
            ></i>
          ) : !isWork && !loading ? (
            <i
              class="fa fa-exclamation-circle"
              style={{
                fontSize: 30,
              }}
              aria-hidden="true"
            ></i>
          ) : loading ? (
            <span>loading...</span>
          ) : null}
        </a>
        <a
          target="_blank"
          style={{
            color: "orange",
            marginTop: 20,
            cursor: "pointer",
          }}
          class="text-center warning"
        >
          {isWork && !loading ? (
            <i
            onClick={()=>Disable(props.ip?.split(':')[2])}
              class="fa fa-pause"
              style={{
                fontSize: 30,
                color: "orange",
              }}
              aria-hidden="true"
            ></i>
          ) : (
            <i
            onClick={()=>Active(props.cmd)}
              class="fa fa-play"
              style={{
                fontSize: 30,
              }}
              aria-hidden="true"
            ></i>
          )}
        </a>
      </div>
    </div>
  );
}
