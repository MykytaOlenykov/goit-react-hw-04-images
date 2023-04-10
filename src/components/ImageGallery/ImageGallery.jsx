import { Component } from 'react';
import PropTypes from 'prop-types';
import * as imgsAPI from 'services';
import { ImageGalleryItem } from 'components/ImageGalleryItem';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader';
import { Gallery } from './ImageGallery.styled';

export class ImageGallery extends Component {
  static propTypes = {
    imgName: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    page: 1,
    isLoading: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevImgName = prevProps.imgName;
    const nextImgName = this.props.imgName;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (nextImgName !== prevImgName) {
      this.setState({ isLoading: true, page: 1, images: [] });

      try {
        const data = await imgsAPI.getImgs(nextPage, nextImgName);
        this.setState({ images: data.hits });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    if (nextPage > prevPage) {
      this.setState({ isLoading: true });

      try {
        const data = await imgsAPI.getImgs(nextPage, nextImgName);
        this.setState(({ images }) => ({
          images: [...images, ...data.hits],
        }));
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  handleLoadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  render() {
    const { images, isLoading } = this.state;

    return (
      <>
        <Gallery>
          {images.map(({ id, tags, largeImageURL }) => (
            <ImageGalleryItem key={id} descr={tags} imgUrl={largeImageURL} />
          ))}
        </Gallery>

        {isLoading ? (
          <Loader />
        ) : (
          images.length !== 0 && <Button onLoadMore={this.handleLoadMore} />
        )}
      </>
    );
  }
}
