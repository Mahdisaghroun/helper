import React, { useState } from "react";

import Modal from "react-modal";
export default function SubmitModal(props) {
  const [th, setth] = useState(props.th);
  const [selection, setselection] = useState([])
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "50%",
      margin: 50,
    },
  };
  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
  return (
    <Modal isOpen={true} style={customStyles} contentLabel="Example Modal" onRequestClose={props.onClose}>
      <h2>Confirm Data Order</h2>

      <div className="mt-5">
        <div class="row clearfix">
          <div class="col-md-12 column">
            <table class="table table-bordered table-hover" id="tab_logic">
              <thead>
                <tr>
                  {th.map((el, i) => (
                    <th class="text-center">{el}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr id="addr0">
                {th.map((el, i) => (
                   <td>
                   <input
                     type="number"
                     name="id"
                     placeholder="ID"
                     class="form-control"
                     min="0"
                     max={th?.length-1}
                     onChange={(e)=>{
                        let s  = selection
                        console.log(selection)
                        s[i]=e.target.value
                        console.log(s)
                        setselection(s)
                     }}
                   />
                 </td>
                  ))}
                 
               
                </tr>
              </tbody>
            </table>
       <button
              className="btn btn-success text-center"
              type="button"
              onClick={() =>{
                if(th.length!==selection.length){
                    alert('Please complete all TH id ')
                }
                else   if(hasDuplicates(selection)){
                    alert('Duplicate id , please make sure to set for every TH an ID ')
                }
                else {
                    let freshArr = []
                 selection.map((el,i)=>{
                    freshArr[el]=th[i]
                 })
                 console.log(freshArr)
                 props.submitFn(freshArr)
                }
              }}
            
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
