import { initAWS, fetchUserDataByImage } from './helper.js';
import React, { Component, Fragment } from 'react';
import { Card } from 'reactstrap';
import Webcam from '../Webcam';
import PropTypes from 'prop-types';
import verifyUser from '../assets/verifyUser.png';


const propTypes = {
  updateState: PropTypes.func.isRequired,
};

export default class CapturePicture extends Component {

  constructor(props) {
    super(props);
    this.state = {
      screenshot: null,
      foundImageMatch: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.startTimer();
  }

  stopTimer = () => {
    console.log("Timer stopped....");
    clearInterval(this.timer);
  }

  handleClick = () => {
    const screenshot = this.webcam.getScreenshot();
    if (screenshot === null) {
      return;
    }
    initAWS();
    fetchUserDataByImage(screenshot, this.props.updateState, this.stopTimer);
    this.setState({ screenshot });
  }

  startTimer = () => {
    console.log("Timer started....");
    clearInterval(this.timer)
    this.timer = setInterval(this.handleClick, 3000)
  }

  render() {
    return (
      <Fragment>
        <Card style={{width:"400", height:"300", borderRadius:"25px"}}>
          <Webcam
            style={{objectFit:"fill", borderRadius:"25px"}}
            audio={false}
            ref={node => this.webcam = node}
          />
        </Card>
      </Fragment>
    );
  }
}


CapturePicture.propTypes = propTypes;
