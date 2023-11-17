import React, { useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { refreshF1Token } from "../../api/api";
import Modal from "react-modal";
import Axios from "axios";
import { baseurl } from "../../utils/config";

export default function ModalLogin(props) {
  const { addToast } = useToasts();
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [link, setlink] = useState();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const linkRef = useRef();
  const passRef = useRef();
  const pinRef = useRef()
  const refreshTokenData = async () => {
    const res = await refreshF1Token();
    if (res.data.success == true) {
      addToast("Created Successfully", { appearance: "success" });
    } else addToast("Error Occured please try again", { appearance: "error" });
  };
  function openModal() {
    setIsOpen(true);
  }
  const saveLogin = () => {
    var data = {
      "email": linkRef?.current.value,
      "password": passRef?.current.value,
      "pin": pinRef?.current.value ?? ''
    }



    localStorage.setItem('loginData', JSON.stringify(data))


    addToast("Created Successfully", { appearance: "success" });
    props.onClose()
    window.location.reload()



  }
  const changeLink = async () => {
    setloading(true);
    //"bpaoletti88@libero.it"
    //"napoli90"
    var data = JSON.stringify({
      Email: linkRef?.current.value,
      Password: passRef?.current.value,
      Platform: "ios",

    });

    var config = {
      method: "post",
      url: baseurl + "/loginDazn",
      headers: {
        Accept: "*/*",


        "Content-Type": "application/json",



      },
      data: data,
    };

    Axios(config)
      .then(function (response) {
        setloading(false);
        if (response.data) {
          addToast("Login Successfully", { appearance: "success" });
          localStorage.setItem(
            "accessTokenIt",
            "" + response?.data?.AuthToken?.Token
          );
          props.reload(response?.data?.AuthToken?.Token)
          props.onClose()

        }
      })
      .catch(function (error) {
        setloading(false);
        console.log(error.response.data["odata.error"].message.value);
        addToast(error?.response?.data["odata.error"]?.message?.value, {
          appearance: "error",
        });
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
      zIndex: 99999,
      position: 'absolute'
    },
  };
  const ModalLink = () => (
    <Modal

      style={customStyles}
      isOpen={modalIsOpen}
      onRequestClose={props.onClose}
    >
      <form style={{
        // position: 'absolute',
        zIndex: 999999
      }} >
        <div class="form-group">
          <label for="daznusern">Email</label>
          <input
            type="text"
            ref={linkRef}
            class="form-control"
            placeholder="Email"
          />
        </div>
        <div class="form-group">
          <label for="daznuserp">Password</label>
          <input
            type="password"
            ref={passRef}
            class="form-control"
            placeholder="Password"
          />
        </div>
        <div class="form-group">
          <label for="daznuserppin">PIN</label>
          <input
            type="text"
            ref={pinRef}
            class="form-control"
            placeholder="PIN"
          />
        </div>
        {/*  <button
          type="button"
          class="btn btn-primary"
          onClick={() => changeLink()}
          disabled={loading}
        >
          {loading ? "..." : "Login"}
        </button> */}
        <button
          style={{
            marginLeft: 10
          }}
          type="button"
          class="btn btn-success"
          onClick={() => saveLogin()}
          disabled={loading}
        >
          {loading ? "..." : "Save"}
        </button>
      </form>
    </Modal>
  );
  return <ModalLink></ModalLink>;
}
