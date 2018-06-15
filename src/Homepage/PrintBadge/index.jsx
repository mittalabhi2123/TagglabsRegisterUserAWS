import React from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import Badge from '../Badge';
import {checkInUser} from '../../CapturePicture/helper.js';
import printBadge from '../../assets/button.png';

const propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default class PrintBadge extends React.Component {

  print = () => {
    var content = document.getElementById("cardComponent");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write('<html><head><link rel="stylesheet" media="print" href="../../printBadge.css" type="text/css" /></head><body>');
    pri.document.write(content.innerHTML);
    pri.document.write('</body></html>');
    pri.document.close();
    pri.focus();
    pri.print();
    checkInUser(this.props.id);
  }

  render() {
    return (
      <div>
        <iframe title="printBadge" id="ifmcontentstoprint" style={{height: "0px", width: "0px", position: "absolute"}}></iframe>
        <Row>
          <div id="cardComponent" style={{margin: "0px", padding: "0px"}}>
            <Badge
              name={this.props.name}
              email={this.props.email}
              phone={this.props.phone}
              company={this.props.company}
              image={this.props.image} />
          </div>
        </Row>
        <Row>
          <Col style={{paddingLeft:"20%"}}>
            <button type="button" onClick={this.print} style={{borderRadius:"12px", borderWidth:"0px", width:"160px", height:"60px"}}>
              <img width="100%" height="70%" border-radius="12px" padding="2px" src={printBadge} alt=""/>
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}
PrintBadge.propTypes = propTypes;
