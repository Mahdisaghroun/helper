import React, { useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { refreshF1Token } from "../../api/api";
import Modal from "react-modal";
import Axios from "axios";
import { baseurl } from "../../utils/config";

export default function ModallAdd(props) {
  const { addToast } = useToasts();
  const [modalIsOpen, setIsOpen] = React.useState(props.isOpenAdded);
const [privelleges, setprivelleges] = useState([])
const [username, setUsername] = useState()
const [password, setPassword] = useState()
const userRef = useRef()
const passRef = useRef()
const [loginData, setloginData] = useState({
    username:"",
    password:""
})
  let data = [
    "ELEVEN SPORT WORLD",
    "ELEVEN SPORT ITALIA",
    "FIFA+ WORLD",
    "F1 PASS TV",
    "LNP BASKET A2/B",
    "VOLLEYBALLWORLD",
    "DISCOVERY+",
    "RAI",
    "SERIE A HIGHLIGHT",
  ];
  const refreshTokenData = async () => {
    const res = await refreshF1Token();
    if (res.data.success == true) {
        props.reload(res.data.staffs)
      addToast("Created Successfully", { appearance: "success" });
    } else addToast("Error Occured please try again", { appearance: "error" });
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

const add=()=>{
    var data = JSON.stringify({
        "username": userRef?.current.value,
        "password": passRef?.current.value,
        "privillege": [
         ...privelleges
        ]
      });
      
      var config = {
        method: 'post',
        url: baseurl+'/addStaf',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      Axios(config)
      .then(function (response) {
        if (response.data.success == true) {
            addToast("Created Successfully", { appearance: "success" });
           props.reload(response.data.staffs)
          } 
      })
      .catch(function (error) {
        addToast("Error Occured please try again", { appearance: "error" });
      });
}
const changePri=(e)=>   {
    setprivelleges([...privelleges,e.target.value])
}  
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
    },
  };
  const ModalLink = () => (
    <Modal
      style={customStyles}
      isOpen={true}
      onRequestClose={props.onClose}
    >
      <form>
        <div class="form-group">
          <label >Username</label>
          <input ref={userRef} type="text" class="form-control" value={userRef?.current?.value} />
        </div>
        <div class="form-group">
          <label   >Password</label>
          <input type="text" class="form-control" ref={passRef} value={passRef?.current?.value}/>
        </div>
    <div className="row text-center" style={{

        justifyContent:"center"
    }}>
{data.map((el,i)=>(
    <div class="form-check form-check-inline" style={{
        margin:5
    }}>
    <input class="form-check-input" type="checkbox"  value={el} onChange={changePri} checked={privelleges.indexOf(el)>-1}/>
    <label class="form-check-label" >{el}</label>
  </div>
))}
    </div>
        

       

        <button type="button" class="btn btn-primary" onClick={add}>
          Add
        </button>
      </form>
    </Modal>
  );
  return <ModalLink></ModalLink>;
}
