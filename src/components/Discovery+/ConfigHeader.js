import React, { useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { refreshF1Token } from "../../api/api";
import Modal from "react-modal";
import Axios from "axios";
import { baseurl } from "../../utils/config";

export default function ConfigHeader(props) {
  const { addToast } = useToasts();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [link, setlink] = useState()
  const linkRef = useRef()
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
    var data = JSON.stringify({
      "key": "discovery",
      "value":linkRef?.current?.value
    });
    
    var config = {
      method: 'put',
      url: baseurl+'/updateLink',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    Axios(config)
    .then(function (response) {
      if (response.data.success == true) {
        addToast("Update Successfully", { appearance: "success" });
        setIsOpen(false)
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
          <label for="exampleInputEmail1">Link</label>
          <input type="text" ref={linkRef} class="form-control" placeholder="F1 Link" defaultValue={props.discoveryLink} />
        </div>

        <button type="button" class="btn btn-primary" onClick={()=>changeLink()}>
          Change
        </button>
      </form>
    </Modal>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
      }}
    >
      <ModalLink></ModalLink>
      <div class="input-group container" style={{
                    marginTop:20
                }} >
            <input class="form-control border-end-0 border rounded-pill" type="text"  id="example-search-input" placeholder="Search" onChange={props.onFilter} />
           
     </div>
     {/*  <button
        className="btn btn-info float-right mt-2"
        style={{ marginRight: 20 }}
        onClick={()=>{openModal()}}
      >
        <i className="fas fa-link"></i> Change Link
      </button>{" "} */}
      <br /> <br />
   
      
    </div>
  );
}
