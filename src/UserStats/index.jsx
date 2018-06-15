import React from 'react';
import { Row, Col, Table, Alert } from 'reactstrap';
import Filter from './Filter'
import {getImageUrl,fetchLoggedInData} from '../CapturePicture/helper.js';

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
    this.state.data.Items.forEach(item => {
      count2++;
      const obj = item;
      if (!obj.hasOwnProperty('LoginTime')) {
        obj.LoginTime = {'S':''};
        unregistered++;
      }
      rows.push(obj);
    })
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
                      <td>{x.LoginTime.S}</td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </Row>
      </div>
    );
  }
}
