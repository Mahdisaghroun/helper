import React, { useEffect, useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { refreshF1Token } from "../../api/api";
import Modal from "react-modal";
import Axios from "axios";
import { baseurl } from "../../utils/config";

export default function ModallAdd(props) {
  const { addToast } = useToasts();
  const [modalIsOpen, setIsOpen] = React.useState(props.isOpenAdded);
const [privelleges, setprivelleges] = useState(props?.user?[...props.user?.privillege]:[])
const [username, setUsername] = useState()
const [password, setPassword] = useState()
const userRef = useRef()
const passRef = useRef()
const [action, setaction] = useState(props.user?props.user.action:1)
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
    "DISCOVERY + IT",
    "RAI IT (GEO)",
    "SERIE A HIGHLIGHT",
    "MEDIASET IT (GEO)",
    "DAZN IT",
    "DAZN DE",
    "DASHBOARD",
    "WORLD PADEL TOUR",
    "MOTO GP",
...props.newsection
 
  ];
  useEffect(() => {
    console.log(props)
   if(userRef.current){
    userRef.current.value="ffffff"
   }
  }, [userRef])
  
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
        ],
        "action":action
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
const update=()=>{

 
var data = JSON.stringify({
  "id": props.id,
  "newdata": {
    "username": userRef?.current.value,
    "password": passRef?.current.value,
    "privillege": [
     ...privelleges
    ],
    
    "action": action
  }
});

var config = {
  method: 'put',
  url: baseurl+'/updateStaf',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

Axios(config)
.then(function (response) {
  if (response.data.success == true) {
      addToast("Created Successfully", { appearance: "success" });
      props.onre()
     props.reload(response.data.staff)
    } 
})
.catch(function (error) {
  addToast("Error Occured please try again", { appearance: "error" });
});
  
}
const changePri=(e)=>   {
  if(e.target?.checked)
    setprivelleges([...privelleges,e.target.value])
    else {
      if(privelleges.indexOf(e.target.value)>-1)
     { let arr = privelleges
      console.log(arr)
      console.log(privelleges.indexOf(e.target.value))
      arr.splice(privelleges.indexOf(e.target.value),1)
      console.log(arr)
      setprivelleges([...arr])}
    }
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
          <input ref={userRef} type="text" class="form-control" value={userRef?.current?.value}  defaultValue={props.user?.username} />
        </div>
        <div class="form-group">
          <label   >Password</label>
          <input type="text" class="form-control" ref={passRef} value={passRef?.current?.value}defaultValue={props.user?.password}/>
        </div>
    <div className="row text-center" style={{

        justifySelf:"center",
        padding:20
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
        
    <hr></hr>
<h5>User action</h5>
<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={action===0} onChange={e=>setaction(0)}  />
  <label class="form-check-label" for="flexRadioDefault1">
    write/read
  </label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={action===1} onChange={e=>setaction(1)}/>
  <label class="form-check-label" for="flexRadioDefault2">
    read only
  </label>
</div>
       

        <button type="button" class="btn btn-primary"
      style={{
        marginTop:10+10
      }}
        onClick={props.user?update:add}>
          {!props.user?"Add":"Update"}
        </button>
      </form>
    </Modal>
  );
  return <ModalLink></ModalLink>;
}
