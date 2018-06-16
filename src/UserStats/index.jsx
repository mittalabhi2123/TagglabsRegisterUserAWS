import React from 'react';
import { Row, Col, Table, Alert } from 'reactstrap';
import Filter from './Filter';
import moment from 'moment-timezone';
import {getImageUrl,fetchLoggedInData} from '../CapturePicture/helper.js';
import {CSVLink, CSVDownload} from 'react-csv';

export default class UserStats extends React.Component {
  state = {
    data: null,
  };

  filterData = (clientId) => {
    this.setState({clientId});
    fetchLoggedInData(
      clientId,
      data => {
        this.setState({data});
      }
    );
  }

  getUrl = (fileName) => {
    return getImageUrl(this.state.clientId, fileName);
  }

  formatTime = (dateTimeStr) => {
    if(dateTimeStr === '' || dateTimeStr === null)
      return '';
    //var date1 = new Date(dateTimeStr);
    //return date1.addHours(5.5).toString()
    var mm = new moment(new Date(dateTimeStr));
    return mm.clone().tz("Asia/Kolkata").format('LLL');
  }

  render() {
    if (this.state.data === null) {
      return (
        <div>
          <Row>
            <Col>
              <Filter filter={this.filterData} />
            </Col>
          </Row>
          <Row style={{marginTop:"4px", padding:"5px"}}>
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Login Time</th>
                </tr>
              </thead>
            </Table>
          </Row>
        </div>
      );
    }
    var count = 1;
    var count2 = 0;
    var unregistered = 0;
    const rows = [];
    const downloadableRows = [];
    this.state.data.Items.forEach(item => {
      count2++;
      const obj = item;
      if (!obj.hasOwnProperty('LoginTime')) {
        obj.LoginTime = {'S':''};
        unregistered++;
      }
      rows.push(obj);
    });
    rows.map(x => {
      var rowData = [];
      rowData.push(x.Name.S);
      rowData.push(x.Email.S);
      rowData.push(x.ContactNumber.S);
      rowData.push(this.formatTime(x.LoginTime.S));
      downloadableRows.push(rowData);
    });
    return (
      <div>
        <Row>
          <Col>
            <Filter filter={this.filterData} />
          </Col>
        </Row>
        <Row style={{marginTop:"10px"}}>
          <Col>
            <Alert color="dark">
              Total Users: {count2} &emsp; Checked In: {count2-unregistered}
            </Alert>
          </Col>
        </Row>
        <Row style={{marginTop:"4px", padding:"5px"}}>
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Login Time</th>
              </tr>
            </thead>
            <tbody>
                {
                  rows.map(x =>
                    <tr key={x.UserId.S}>
                      <th scope="row">{count++}</th>
                      <td><img width="64px" height="64px" src={this.getUrl(x.ImageFile.S)} alt=""/></td>
                      <td>{x.Name.S}</td>
                      <td>{x.Email.S}</td>
                      <td>{x.ContactNumber.S}</td>
                      <td>{this.formatTime(x.LoginTime.S)}</td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </Row>
        <Row>
          <CSVLink data={downloadableRows}>Export to CSV</CSVLink>
        </Row>
      </div>
    );
  }
}
