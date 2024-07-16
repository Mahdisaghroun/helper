import React, { Component, useState } from "react";
import "./SidebarTemplate.css";
import classnames from "classnames";
import PropTypes from "prop-types";
import Avatar from "../../../images/avatar.png";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutAdmin } from "../../../actions/adminActions";
import { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Axios from "axios";

function SidebarTemplate(props) {
  const location = useLocation();
  const [features, setfeatures] = useState();
  const [toggled, settoggled] = useState(false);
  const [currentPath, setcurrentPath] = useState();
  const [sectionNames, setSectionsName] = useState();
  const [user, setuser] = useState();
  const [ipInfo, setipInfo] = useState(null);
  useEffect(() => {
    const currentPath = location.pathname;
    setcurrentPath(currentPath);
  }, [location]);
  const minimizeSidebar = (e) => {
    e.preventDefault();

    settoggled(!toggled);
  };
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      setuser(JSON.parse(user));
    }
    let features = localStorage.getItem("features");
    if (features) {
      setfeatures(JSON.parse(features));
    }
    let sectionName = localStorage.getItem("sections");
    if (sectionName) {
      setSectionsName(JSON.parse(sectionName));
    }
  }, []);
  useEffect(() => {
    async function fet() {
      let ipres = await Axios.get("http://ipwho.is/");
      setipInfo(ipres.data);
    }
    fet();
  }, []);

  const onLogoutHandler = () => {
    props.logoutAdmin();
  };

  const admin = props.admin;
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
    "SCHEDULE",
    "MEDIASET ITALIA BLOCK GEO",
  ];
  return (
    <div className={classnames("d-flex", { toggled: toggled })} id="wrapper">
      {/*  Sidebar */}
      <div
        className=" border-right"
        id="sidebar-wrapper"
        style={{
          backgroundColor: "#000000",
        }}
      >
        <div className="sidebar-heading text-center text-light ">
          <img
            src="logo.png"
            alt="avatar"
            className="rounded-circle"
            style={{ width: "100px", height: "100px" }}
          />
          <h3>ZEROBUG</h3>
          <small>{admin.national_id}</small>
        </div>
        <div className="list-group list-group-flush">
        
          {true && (
            <Link
              to="/daznit"
              className={`list-group-item list-group-item-action bg-${
                currentPath == "/daznit" ? "warning" : "transparent"
              } text-light`}
            >
              <i className="fas fa-tv"></i> DAZN 
            </Link>
          )}
          {true && (
            <Link
              to="/lnp"
              className={`list-group-item list-group-item-action bg-${
                currentPath == "/lnp" ? "warning" : "transparent"
              } text-light`}
            >
              <i className="fas fa-tv"></i> LNP BASKET A2/B
            </Link>
          )}
          {/*    {(props.admin.isAdmin || user?.privillege?.indexOf("DASHBOARD") > -1) && <Link
            to="/dashboard"
            className={`list-group-item list-group-item-action bg-${currentPath == "/dashboard" ? "primary" : "dark"
              } text-light`}
          >
            <i class="fa fa-calendar" aria-hidden="true"></i>{" "}
            {sectionNames && sectionNames[14]
              ? sectionNames[14]
              : " DASHBOARD"}
          </Link>} */}
          {/* <Link
            to="/schedule"
            className={`list-group-item list-group-item-action bg-${currentPath == "/schedule" ? "primary" : "dark"
              } text-light`}
          >
            <i class="fa fa-calendar" aria-hidden="true"></i>{" "}
            {sectionNames && sectionNames[0]
              ? sectionNames[0]
              : " SCHEDULE  EVENT"}
          </Link> */}
          {/* {(props.admin.isAdmin ||
            user?.privillege?.indexOf("ELEVEN SPORT WORLD") > -1) && (
              <Link
                to="/elevensport"
                className={`list-group-item list-group-item-action bg-${currentPath == "/elevensport" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[1]
                  ? sectionNames[1]
                  : " ELEVEN SPORT"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("ELEVEN SPORT ITALIA") > -1) && (
              <Link
                to="/elevensportitalia"
                className={`list-group-item list-group-item-action bg-${currentPath == "/elevensportitalia" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[2]
                  ? sectionNames[2]
                  : " ELEVEN SPORT ITALIA"}
              </Link>
            )} */}

          {props.admin?.isAuthenticated ? (
            <img
              src="https://i.pinimg.com/236x/39/b0/42/39b042e14a94642863071fb3099e1be4.jpg"
              style={{
                height: "100vh",
                objectFit: "cover",
              }}
              height={"100%"}
            />
          ) : (
            <Redirect to="/"></Redirect>
          )}
          
          {/* {(props.admin.isAdmin ||
            user?.privillege?.indexOf("DAZN DE") > -1) && (
              <Link
                to="/daznde"
                className={`list-group-item list-group-item-action bg-${currentPath == "/daznde" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[12] ? sectionNames[12] : " DAZN DE"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("DAZN ES") > -1) && (
              <Link
                to="/daznes"
                className={`list-group-item list-group-item-action bg-${currentPath == "/daznes" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[13] ? sectionNames[13] : " DAZN ES"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("FIFA+ WORLD") > -1) && (
              <Link
                to="/fifa"
                className={`list-group-item list-group-item-action bg-${currentPath == "/fifa" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[3]
                  ? sectionNames[3]
                  : " FIFA+WORLD"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("F1 PASS TV") > -1) && (
              <Link
                to="/f1"
                className={`list-group-item list-group-item-action bg-${currentPath == "/f1" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[4]
                  ? sectionNames[4]
                  : " F1 PASS TV"}
              </Link>
            )}
            *
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("LNP BASKET A2/B") > -1) && (
              <Link
                to="/lnp"
                className={`list-group-item list-group-item-action bg-${currentPath == "/lnp" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[5]
                  ? sectionNames[5]
                  : "LNP BASKET A2/B"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("VOLLEYBALLWORLD") > -1) && (
              <Link
                to="/volleyball"
                className={`list-group-item list-group-item-action bg-${currentPath == "/volleyball" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[6]
                  ? sectionNames[6]
                  : " VOLLEYBALLWORLD"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("DISCOVERY + IT") > -1) && (
              <Link
                to="/discovery"
                className={`list-group-item list-group-item-action bg-${currentPath == "/discovery" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[7]
                  ? sectionNames[7]
                  : " DISCOVERY + IT"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("RAI IT (GEO)") > -1) && (
              <Link
                to="/rai"
                className={`list-group-item list-group-item-action bg-${currentPath == "/rai" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[8]
                  ? sectionNames[8]
                  : " RAI IT (GEO)"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("SERIE A HIGHLIGHT") > -1) && (
              <Link
                to="/serieA"
                className={`list-group-item list-group-item-action bg-${currentPath == "/serieA" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[9]
                  ? sectionNames[9]
                  : "SERIE A HIGHLIGHT"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("MEDIASET IT (GEO)") > -1) && (
              <Link
                to="/mediaset"
                className={`list-group-item list-group-item-action bg-${currentPath == "/mediaset" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[10]
                  ? sectionNames[10]
                  : " MEDIASET IT (GEO)"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("MOTO GP") > -1) && (
              <Link
                to="/motogp"
                className={`list-group-item list-group-item-action bg-${currentPath == "/motogp" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[10]
                  ? sectionNames[10]
                  : " MOTO GP"}
              </Link>
            )}
          {(props.admin.isAdmin ||
            user?.privillege?.indexOf("WORLD PADEL TOUR") > -1) && (
              <Link
                to="/worldpadel"
                className={`list-group-item list-group-item-action bg-${currentPath == "/worldpadel" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i>{" "}
                {sectionNames && sectionNames[15]
                  ? sectionNames[15]
                  : " WORLD PADEL TOUR"}
              </Link>
            )}
          {features?.map((el, i) => {
            let hasView = (props.admin.isAdmin ||
              user?.privillege?.indexOf("" + el.key) > -1)
            return (
              hasView ? <Link
                to={el.path}
                className={`list-group-item list-group-item-action bg-${currentPath === el.path ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-tv"></i> {el.key}
              </Link> : null
            )

          })}
          {props.admin.isAdmin && (
            <div
              style={{
                marginBottom: 80,
              }}
            >
              <hr></hr>
              <h6 style={{ color: "white", textAlign: "center" }}>
                Admin Control
              </h6>
              <Link
                to="/staff"
                className={`list-group-item list-group-item-action bg-${currentPath == "/staff" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fas fa-users"></i> STAFFS
              </Link>
              <Link
                to="/features"
                className={`list-group-item list-group-item-action bg-${currentPath == "/features" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fa fa-plus-square"></i> SECTIONS{" "}
              </Link>
              <Link
                to="/config"
                className={`list-group-item list-group-item-action bg-${currentPath == "/config" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fa fa-cog"></i> CONFIG{" "}
              </Link>
              <Link
                to="/rename"
                className={`list-group-item list-group-item-action bg-${currentPath == "/rename" ? "primary" : "dark"
                  } text-light`}
              >
                <i className="fa fa-folder"></i> RENAME
              </Link>
            </div>
          )} */}
        </div>
      </div>
      {/*  /#sidebar-wrapper */}

      {/* Page Content */}
      <div
        className="background-image"
        style={{
          backgroundSize: "contain",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1519575706483-221027bfbb31?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.8, // Adjust the opacity to control the blur effect
          filter: "blur(5px)", // Apply a blur to the background
          zIndex: -1,
        }}
      />
      <div
        id="page-content-wrapper"
        style={{
          backgroundColor: "black",
        }}
      >
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent border-bottom">
          <button className="btn btn-light" onClick={minimizeSidebar}>
            {" "}
            {toggled ? (
              <i className="fas fa-arrow-right fa-lg"></i>
            ) : (
              <i className="fas fa-arrow-left fa-lg"></i>
            )}{" "}
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <div className="nav-link logout" style={{ color: "white" }}>
                  VERSION 1.0
                </div>
              </li>
              <li
                className="nav-item float-right"
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  //backgroundColor:"red",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div>
                  <span
                    class="badge badge-light "
                    style={{
                      marginLeft: 40,
                    }}
                  >
                    {ipInfo?.ip}
                  </span>
                  <span
                    class="badge badge-light"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {ipInfo?.country_code}
                  </span>
                  <span
                    class="badge badge-light"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <img
                      style={{ width: 10, height: 10 }}
                      src={ipInfo?.flag?.img}
                    ></img>
                  </span>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <div
                  style={{ color: "white" }}
                  className="nav-link logout"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <div
          className="container-fluid sidebar-template"
          style={{ position: "relative" }}
        >
          <div
            className="content"
            style={{
              minHeight: "100vh",
              position: "relative",
              zIndex: 0,
            }}
          >
            {props.children}
          </div>
        </div>
      </div>
      {/* page-content-wrapper */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  features: state.admin.features,
});

export default connect(mapStateToProps, { logoutAdmin })(SidebarTemplate);
