import React from 'react';
import { getImageUrl, fetchDistinctClients } from '../CapturePicture/helper.js';
import { Row, Col } from 'reactstrap';
import CapturePicture from '../CapturePicture';
import PrintBadge from './PrintBadge';
import Badge from './Badge';

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      name: '',
      email: '',
      phone: '',
      company: '',
      url: '',
      id: '',
      screenshot: '',
    };
  }

  updateState = (element, image, externalId) => {
    console.log(element.Name.S + " " + element.Email.S + " " + element.ContactNumber.S + " " + element.Company.S);
    if (this.state.email === element.Email.S) {
      console.log("Same User found. Not updating the details:" + this.state.email);
      return;
    }
    this.setState({
      name: element.Name.S,
      email: element.Email.S,
      phone: element.ContactNumber.S,
      company: element.Company.S,
      screenshot: image,
      client: element.Client.S,
      imageFile: element.ImageFile.S,
      url: getImageUrl(element.Client.S, element.ImageFile.S),
      id: externalId,
    });
  }

  stats = () => {
    fetchDistinctClients((clientIdSet) => this.setState({
      clientIds: clientIdSet
    }));
  }

  render() {
    return (
      <div>
        <Row>
          <Col style={{marginLeft:"2%", "marginTop":"0%", "marginBottom":"0%"}}>
            <Badge
              name={this.state.name}
              email={this.state.email}
              phone={this.state.phone}
              company={this.state.company}
              image={this.state.url} />
          </Col>
          <Col style={{margin:"5%", "marginTop":"0%", "marginBottom":"0%"}}>
            <CapturePicture updateState={this.updateState}/>
          </Col>
          <Col style={{marginRight:"2%", "marginTop":"0%", "marginBottom":"0%"}}>
            <PrintBadge
              name={this.state.name}
              email={this.state.email}
              phone={this.state.phone}
              company={this.state.company}
              image={this.state.screenshot}
              id={this.state.id}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
