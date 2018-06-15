import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default class Badge extends React.Component {

  render() {
    return (
      <div>
        <Card style={{width:"3in", height:"5in", borderRadius:"25px", backgroundColor:"#306BB7"}}>
          <img width="100%" height="70%" src={this.props.image} alt=""/>
          <CardBody style={{"lineHeight":"0.5"}}>
            <CardTitle style={{color: "white"}}>{this.props.name}</CardTitle>
            <hr/>
            <CardText style={{color: "white"}}>{this.props.company}</CardText>
            <CardText style={{color: "white"}}>{this.props.email}</CardText>
            <CardText style={{color: "white"}}>{this.props.phone}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
}
Badge.propTypes = propTypes;
