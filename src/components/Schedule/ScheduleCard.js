import Axios from 'axios';
import React, { useState } from 'react'
import { baseurl } from '../../utils/config';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
export default function ScheduleCard(props) {
  
  const deleteEvent=(key)=>{
    var data = JSON.stringify({
      "key": key
    });
    
    var config = {
      method: 'delete',
      url: baseurl+'/deleteEvent',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    Axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      props.reload()
    })
    .catch(function (error) {
      console.log(error);
    });
  }
 const  submit = (id) => {
 
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delete this section.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteEvent(id),
          className:"btn btn-danger"
        },
        {
          label: 'No',
        
        }
      ]
    });
  };

    return (
        <div class="col-sm-2" style={{
            margin:10,
           
        }}>
           
    <div class="card " style={{
        borderRadius:8,
      
        height:180,
        paddingRight:10,
        paddingLeft:10,
       
      
        justifyContent:"center",
        alignContent:"center"
    }}>
       
      <p class="text-center" style={{
      
       
      }} >{props.title} </p>
     
      <a href={""+props.url} target="_blank"  class="text-center"><i class="fa fa-arrow-right"></i></a>
      <a   target="_blank" 
      onClick={()=>{
        submit(props.title)
      }}
      style={{

color:"red",
marginTop:20,
cursor:'pointer'

      }}  class="text-center danger"><i class="fa fa-trash" aria-hidden="true"></i></a>
    </div>
  </div>
    )
}
