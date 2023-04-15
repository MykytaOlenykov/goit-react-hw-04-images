import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import * as imgsAPI from 'services';
import { ImageGalleryItem } from 'components/ImageGalleryItem';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader';
import { Gallery } from './ImageGallery.styled';
import { toast } from 'react-toastify';

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

  galleryRef = createRef();

  getSnapshotBeforeUpdate(_, prevState) {
    if (prevState.images.length < this.state.images.length) {
      const gallery = this.galleryRef.current;
      return gallery.scrollHeight - gallery.scrollTop;
    }
    return null;
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const prevImgName = prevProps.imgName;
    const nextImgName = this.props.imgName;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (snapshot !== null) {
      window.scrollTo({ top: snapshot, behavior: 'smooth' });
    }

    if (nextImgName !== prevImgName) {
      this.setState({ isLoading: true, page: 1, images: [], total: 0 });

      try {
        const data = await imgsAPI.getImgs(nextPage, nextImgName);

        if (!data.hits.length) {
          toast.error(`No results found for ${nextImgName}`);
          return;
        }

        this.checkIsAllColection(data.hits.length, data.totalHits);

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

        this.checkIsAllColection(data.hits.length, data.totalHits);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  checkIsAllColection = (colactionSize, total) => {
    if (colactionSize >= total) {
      toast.success(
        `You have uploaded all images for request ${this.props.imgName}`
      );
    }
  };

  handleLoadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  render() {
    const { images, isLoading, total } = this.state;
    const isVisibleBtn = images.length !== 0 && images.length < total;

    return (
      <>
        <Gallery ref={this.galleryRef}>
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
