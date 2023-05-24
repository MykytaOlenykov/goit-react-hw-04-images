import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalStyle } from 'components/GlobalStyle';
import * as imgsAPI from 'services';
import { Searchbar } from 'components/Searchbar';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader';
import { ImageGallery } from 'components/ImageGallery';
import * as S from './App.styled';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);

  const galleryRef = useRef(null);

  const isVisibleBtn =
    !isLoading && images.length !== 0 && images.length < total;

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    setScrollValue(gallery.scrollHeight);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: scrollValue, behavior: 'smooth' });
  }, [scrollValue, images]);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    const checkIsAllCollection = ({ currentPage, total }) => {
      const lastPage = Math.ceil(total / 12);

      if (currentPage === lastPage) {
        toast.success(
          `You have uploaded all images for request ${searchQuery}`
        );
      }
    };

    const fetchImgs = async () => {
      const options = { searchQuery, currentPage };

      try {
        setIsLoading(true);

        const { hits, totalHits } = await imgsAPI.getImgs(options);

        const newImages = hits.map(
          ({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );

        if (currentPage === 1) {
          if (!newImages.length) {
            toast.error(`No results found for ${searchQuery}`);
            return;
          }

          setImages(newImages);
          setTotal(totalHits);
        } else {
          setImages(prevState => [...prevState, ...newImages]);
        }

        checkIsAllCollection({
          currentPage,
          total: totalHits,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImgs();
  }, [searchQuery, currentPage]);

  const validationSearchQuery = newSearchQuery => {
    if (newSearchQuery === searchQuery) {
      toast.info(
        `Request for ${newSearchQuery} already processed. Enter new value.`
      );

      return false;
    }

    return true;
  };

  const handleSubmitForm = searchQuery => {
    const isValid = validationSearchQuery(searchQuery);

    if (isValid) {
      setSearchQuery(searchQuery);
      setCurrentPage(1);
      setImages([]);
      setTotal(0);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prevState => prevState + 1);
  };

  return (
    <S.Container>
      <GlobalStyle />
      <Searchbar onSubmit={handleSubmitForm} isDisabledBtn={isLoading} />
      <ImageGallery ref={galleryRef} images={images} />
      {isVisibleBtn && <Button onLoadMore={handleLoadMore} />}
      {isLoading && <Loader />}
      <ToastContainer autoClose={5000} />
    </S.Container>
  );
};
