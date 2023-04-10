import PropTypes from 'prop-types';
import { Item, Image } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ descr, imgUrl }) => (
  <Item>
    <Image src={imgUrl} alt={descr} />
  </Item>
);

ImageGalleryItem.propTypes = {
  descr: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
};
