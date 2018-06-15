import React from 'react';
import { Input } from 'reactstrap';
import {fetchDistinctClients} from '../../CapturePicture/helper.js';
import PropTypes from 'prop-types';

const propTypes = {
  filter: PropTypes.func.isRequired,
};

export default class Filter extends React.Component {

  state = {
    clientIds: null,
  };

  componentWillMount() {
    fetchDistinctClients(
      clientIds => {
        clientIds = [...clientIds];
        this.setState({clientIds});
      }
    );
  }
  static defaultProps = {
    filter: undefined,
  };

  handleChange = (event) => {
    this.props.filter(event.target.value);
  }

  render() {
    if (this.state.clientIds === null) {
      return (
        <Input type="select" onChange={this.handleChange}>
          <option value="none">Select Client</option>
        </Input>
      );
    } else {
    return (
      <Input type="select" onChange={this.handleChange}>
        <option value="none">Select Client</option>
            {this.state.clientIds.map(x => <option key={x} value={x}>{x}</option>)}
      </Input>
    );
    }
  }
}

Filter.propTypes = propTypes;
