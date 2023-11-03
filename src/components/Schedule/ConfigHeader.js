import React, { useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { refreshF1Token } from "../../api/api";
import Modal from "react-modal";
import Axios from "axios";
import { baseurl } from "../../utils/config";

export default function ConfigHeader(props) {
  const { addToast } = useToasts();
  const [action, setaction] = useState()
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [link, setlink] = useState()
  const linkRef = useRef()
  const valueRef = useRef()
  const refreshTokenData = async () => {
    const res = await refreshF1Token();
    if (res.data.success == true) {
      addToast("Created Successfully", { appearance: "success" });
    } else addToast("Error Occured please try again", { appearance: "error" });
  };
  function openModal() {
    setIsOpen(true);
  }

  const changeLink = async () => {
    var axios = require('axios');
    var key = linkRef?.current?.value;
var obj = {};

obj[key] =valueRef.current?.value;
    var data = JSON.stringify({
     ...obj
    });
    
    var config = {
      method: 'post',
      url: baseurl+'/addEvent',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
   
    .then(function (response) {
      if (response.data.success == true) {
        addToast("Update Successfully", { appearance: "success" });
        setIsOpen(false)
    props.reload(response.data.nodeEvents)
      } else addToast("Error Occured please try again", { appearance: "error" });
    })
    .catch(function (error) {
      addToast("Error Occured please try again", { appearance: "error" });
    });
   
  };

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const ModalLink = () => (
    <Modal style={customStyles} isOpen={modalIsOpen}
    
  
    onRequestClose={closeModal}

    >
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Title</label>
          <input type="text" ref={linkRef} class="form-control"  defaultValue={props.f1Link} />
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Value</label>
          <input type="text" ref={valueRef} class="form-control"  defaultValue={props.f1Link} />
        </div>

        <button type="button" class="btn btn-primary" onClick={()=>changeLink()}>
          Add
        </button>
      </form>
    </Modal>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center"
      }}
    >
      <ModalLink></ModalLink>
      <div class="input-group container" >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" onChange={props.onFilter}/>
           
     </div>

      <button
        className="btn btn-info float-right mt-2"
        style={{ marginRight: 20 }}
        onClick={()=>{openModal()}}
      >
        <i className="fas fa-link"></i>Add Event
      </button>{" "}
     
    </div>
  );
}
