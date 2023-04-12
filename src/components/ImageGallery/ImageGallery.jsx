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
    total: 0,
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevImgName = prevProps.imgName;
    const nextImgName = this.props.imgName;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (nextImgName !== prevImgName) {
      this.setState({ isLoading: true, page: 1, images: [], total: 0 });

      try {
        const data = await imgsAPI.getImgs(nextPage, nextImgName);
        this.setState({ images: data.hits, total: data.totalHits });
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
    const { images, isLoading, total } = this.state;
    const isVisibleBtn = images.length !== 0 && images.length < total;

    return (
      <>
        <Gallery>
          {images.map(({ id, tags, webformatURL, largeImageURL }) => (
            <ImageGalleryItem
              key={id}
              descr={tags}
              imgUrl={webformatURL}
              largeImgURL={largeImageURL}
            />
          ))}
        </Gallery>

        {isLoading ? (
          <Loader />
        ) : (
          isVisibleBtn && <Button onLoadMore={this.handleLoadMore} />
        )}
      </>
    );
  }
}
