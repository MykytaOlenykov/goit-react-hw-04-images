import { Component, createRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalStyle } from 'components/GlobalStyle';
import * as imgsAPI from 'services';
import { Searchbar } from 'components/Searchbar';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader';
import { ImageGallery } from 'components/ImageGallery';
import * as S from './App.styled';

export class App extends Component {
  state = {
    searchQuery: '',
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

  async componentDidUpdate(_, prevState, snapshot) {
    const prevSearchQuery = prevState.searchQuery;
    const nextSearchQuery = this.state.searchQuery;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (snapshot !== null) {
      window.scrollTo({ top: snapshot, behavior: 'smooth' });
    }

    if (nextSearchQuery !== prevSearchQuery) {
      this.setState({ isLoading: true, page: 1, images: [], total: 0 });

      try {
        const data = await imgsAPI.getImgs({
          currentPage: nextPage,
          searchQuery: nextSearchQuery,
        });

        if (!data.hits.length) {
          toast.error(`No results found for ${nextSearchQuery}`);
          return;
        }

        this.setState({ images: data.hits, total: data.totalHits });

        this.checkIsAllColection(data.hits.length, data.totalHits);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    if (nextPage > prevPage) {
      this.setState({ isLoading: true });

      try {
        const data = await imgsAPI.getImgs({
          currentPage: nextPage,
          searchQuery: nextSearchQuery,
        });

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

  handleSubmitForm = searchQuery => {
    const isValid = this.validationSearchQuery(searchQuery);

    if (isValid) {
      this.setState({ searchQuery });
    }
  };

  handleLoadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  validationSearchQuery(newSearchQuery) {
    if (newSearchQuery === this.state.searchQuery) {
      toast.info(
        `Request for ${newSearchQuery} already processed. Enter new value.`
      );

      return false;
    }

    return true;
  }

  checkIsAllColection(colactionSize, total) {
    if (colactionSize >= total) {
      toast.success(
        `You have uploaded all images for request ${this.state.searchQuery}`
      );
    }
  }

  render() {
    const { images, isLoading, total } = this.state;
    const isVisibleBtn = images.length !== 0 && images.length < total;

    return (
      <S.Container>
        <GlobalStyle />
        <Searchbar onSubmit={this.handleSubmitForm} />
        <ImageGallery ref={this.galleryRef} images={images} />
        {isVisibleBtn && <Button onLoadMore={this.handleLoadMore} />}
        {isLoading && <Loader />}
        <ToastContainer autoClose={5000} />
      </S.Container>
    );
  }
}
