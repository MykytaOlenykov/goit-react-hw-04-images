import { Component } from 'react';
import PropTypes from 'prop-types';
import { Gallery } from './ImageGallery.styled';

export class ImageGallery extends Component {
  static propTypes = {
    imgName: PropTypes.string.isRequired,
  };

  componentDidUpdate(prevProps) {
    const prevImgName = prevProps.imgName;
    const nextImgName = this.props.imgName;

    if (nextImgName !== prevImgName) {
    }
  }

  render() {
    return <Gallery></Gallery>;
  }
}
