import React, { useEffect } from "react";
import "./App.css";
import setAdminToken from "./utils/setAdminToken";
import store from "./store";
import { getAdmin } from "./actions/adminActions";
import jwt_decode from "jwt-decode";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import Dashboard from "./components/Dashboard/Dashboard";
import Students from "./components/Students/Students";
import AddStudent from "./components/AddStudent/AddStudent";
import UpdateStudent from "./components/UpdateStudent/UpdateStudent";
import Search from "./components/Search/Search";
import { logoutAdmin } from "./actions/adminActions";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Italia from "./components/ELEVENSPORTITALIA/italia";
import fifa from "./components/FIFIA/fifa";
import F1 from "./components/F1/F1";
import LNP from "./components/LNP/LNP";
import Schedule from "./components/Schedule/Schedule";
import Highlight from "./components/Highlight/Highlight";
import Rai from "./components/Rai/Rai";
import Descovery from "./components/Discovery+/Descovery+";
import Axios from "axios";
import { useState } from "react";
import Staffs from "./components/Staffs/Staffs";
import Volley from "./components/Volley/Volley";
import { baseurl } from "./utils/config";
import Mediaset from "./components/MEDIASET/Mediaset";
import Addfeature from "./components/Addfeaure/addfeature";
import Feature from "./components/Feature/Feature";
import Features from "./components/Features/Features";
import UpdateFeature from "./components/updateFeature/updateFeature";
import Rename from "./components/rename/Rename";
import ReanameSections from "./components/renameSections/reanameSections";
import Dazn from "./components/Dazn/Dazn";
import DaznDe from "./components/DaznDe/DaznDe";
import DaznEs from "./components/DaznES/DaznEs";
import WORLDPADELTOUR from "./components/WORLD-PADEL-TOUR/WORLD-PADEL-TOUR";
import Motogp from "./components/MotoGP/Motogp";

// I want the user to remain logged in even after refreshing the page or moving between pages
if (localStorage.jwtToken) {
  // set the token to the authorization header (the one that you find in postman)
  setAdminToken(localStorage.jwtToken);
  // decode the jwt token to get user data
  const decoded = jwt_decode(localStorage.jwtToken);
  // send the decoded data to a reducer to use the user in our components
  store.dispatch(getAdmin(decoded));

  //check if the token is expired
  const currentTime = Date.now() / 1000;
  if (currentTime > decoded.exp) {
    // logout admin
    store.dispatch(logoutAdmin());
    //redirect to login
    window.location.href = "/";
  }
}

function App() {
  const [data, setData] = useState();
  const [ipInfo, setipInfo] = useState();
  async function fetching() {
    var data = JSON.stringify({
      username: "root",
      password: "178",
    });

    var config = {
      method: "get",
      url: baseurl,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    Axios(config)
      .then(async function (response) {
        console.log(response.data);
        let staff = response.data.staffs
        let user = "user"

        setData(response.data);
        localStorage.setItem(
          "features",
          JSON.stringify(response.data?.features)
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    async function update() {
      let adminData = await localStorage.getItem("admindata");
      if (adminData) {
        var data = JSON.stringify({
          ...JSON.parse(adminData),
        });

        var config = {
          method: "post",
          url: baseurl + "/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let response = await Axios(config);
        if (response.data.success == true) {
          localStorage.setItem("formdata", JSON.stringify(adminData));
          let isAdmin = response.data.isAdmin;
          if (!isAdmin) {
            localStorage.setItem("user", JSON.stringify(response.data.staf));
          }
          // this.props.loginAdmin(isAdmin);
        }
      }
    }
   // fetching()
    // login()
  }, []);
  useEffect(() => {
   
  }, []);
  useEffect(() => {
    async function fet() {
      let ipres = await Axios.get("http://ipwho.is/");
      setipInfo(ipres.data);
    }
    fet();
  }, []);
  return (
    <div className="App">
      {true && (
        <ToastProvider>
          <Route exact path="/" component={AdminLogin} />
          <Switch>
            <Route
              exact
              path={"/daznit"}
              component={(props) => (
                <Dazn
                  nodeLinks={{}}
                  ip={ipInfo}
                  {...props}
                  daznLogin={"x"}
                  reload={() => {}}
                ></Dazn>
              )}
            />
          </Switch>

          {/*  <Switch>
            <PrivateRoute
              exact
              path={"/dashboard"}
              component={(props) => (
                <Dashboard {...props} nodeLinks={data?.nodeLinks} />
              )}
            />
          </Switch>
          <Switch>
            <PrivateRoute exact path={"/elevensport"} component={Students} />
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path={"/elevensportitalia"}
              component={(props)=><Italia {...props} nodeLinks={data?.nodeLinks}></Italia>}
            />
          </Switch>
          <Switch>
            <PrivateRoute exact path={"/fifa"} component={fifa} />
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path={"/f1"}
              component={() => <F1 nodeLinks={data?.nodeLinks}></F1>}
            />
          </Switch>
          <Switch>
            <PrivateRoute exact path={"/lnp"} component={LNP} />
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path={"/schedule"}
              component={() => (
                <Schedule
                  events={data?.events}
                  reload={() => fetching()}
                ></Schedule>
              )}
            />
          </Switch>
          <Switch>
            <PrivateRoute exact path={"/serieA"} component={(props)=><Highlight {...props} nodeLinks={data?.nodeLinks}></Highlight>} />
          </Switch>
          <Switch>
            <PrivateRoute exact path={"/rai"} component={(props)=><Rai {...props} nodeLinks={data?.nodeLinks}></Rai>} />
          </Switch>
          <Switch>
            <PrivateRoute
              exact
              path={"/discovery"}
              component={() => (
                <Descovery nodeLinks={data?.nodeLinks}></Descovery>
              )}
            />
          </Switch>
          <Switch>
            <Route exact path={"/addevents"} component={AddStudent} />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/staff"}
              component={() => (
                <Staffs
                  staffs={data.staffs}
                  newsection={data.features}
                ></Staffs>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/volleyball"}
              component={() => (
                <Volley
                  nodeLinks={data?.nodeLinks}
                  staffs={data.staffs}
                ></Volley>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/mediaset"}
              component={() => <Mediaset></Mediaset>}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/motogp"}
              component={(props)=><Motogp {...props} nodeLinks={data?.nodeLinks}></Motogp>}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/features"}
              component={(props) => (
                <Features
                  {...props}
                  data={data.features}
                  reload={() => fetching()}
                ></Features>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/worldpadel"}
              component={() => <WORLDPADELTOUR></WORLDPADELTOUR>}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/config"}
              component={(props) => (
                <Rename
                  {...props}
                  nodeLinks={data?.nodeLinks}
                  data={data.features}
                  reload={() => fetching()}
                ></Rename>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/addfeature"}
              component={() => <Addfeature></Addfeature>}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/rename"}
              component={() => <ReanameSections></ReanameSections>}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/updatefeature"}
              component={(props) => (
                <UpdateFeature
                  {...props}
                  reload={() => fetching()}
                ></UpdateFeature>
              )}
            />
          </Switch> */}
          {/*   <Switch>
            <Route
              exact
              path={"/daznit"}
              component={(props) => (
                <Dazn
                  nodeLinks={data?.nodeLinks}
                  ip={ipInfo}
                  {...props}
                  daznLogin={data.daznLogin}
                  reload={() => fetching()}
                ></Dazn>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/daznde"}
              component={(props) => (
                <DaznDe
                  nodeLinks={data?.nodeLinks}
                  ip={ipInfo}
                  {...props}
                  daznLogin={data.daznLogin}
                  reload={() => fetching()}
                ></DaznDe>
              )}
            />
          </Switch>
          <Switch>
            <Route
              exact
              path={"/daznes"}
              component={(props) => (
                <DaznEs
                  nodeLinks={data?.nodeLinks}
                  ip={ipInfo}
                  {...props}
                  daznLogin={data.daznLogin}
                  reload={() => fetching()}
                ></DaznEs>
              )}
            />
          </Switch> */}
          {/*  {data.features.map((el, i) => (
            <Switch>
              <Route
                exact
                path={el.path}
                component={() => (
                  <Feature data={el?.data} th={el?.th} el={el}></Feature>
                )}
              />
            </Switch>
          ))} */}
        </ToastProvider>
      )}
    </div>
  );
}

export default App;
