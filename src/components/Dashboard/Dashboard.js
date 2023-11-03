import React, { Component } from "react";
import SidebarTemplate from "../common/SidebarTemplate/SidebarTemplate";
import AreaChart from "../Charts/AreaChart";
import ColumnChart from "../Charts/ColumnChart";
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import CheckItem from "./CheckItem";

class Dashboard extends Component {
  render() {
    return (
      <SidebarTemplate>
        <h2
          style={{
            margin: 10,
          }}
        >
          Server Side Apps Status{" "}
        </h2>
        <div
          class="row float-left"
          style={{
            padding: 50,
          }}
        >
          {Object.keys(this.props.nodeLinks)?.map((el, index) => (
            <CheckItem
              title={el}
              ip={this.props.nodeLinks[el].key}
              cmd={this.props.nodeLinks[el]?.cmd}
              reload={this.props.reload}
            ></CheckItem>
          ))}
        </div>
      </SidebarTemplate>
    );
  }
}

export default Dashboard;
