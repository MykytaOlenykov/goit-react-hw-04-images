import { useState, useEffect, useRef } from 'react';
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
  const galleryRef = useRef(null);

  const isVisibleBtn =
    !isLoading && images.length !== 0 && images.length < total;

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

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    const checkIsAllCollection = ({ collectionSize, total }) => {
      if (collectionSize >= total) {
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

        if (currentPage === 1) {
          if (!hits.length) {
            toast.error(`No results found for ${searchQuery}`);
            return;
          }

          setImages(hits);
          setTotal(totalHits);
        } else {
          setImages(prevState => [...prevState, ...hits]);
        }

        checkIsAllCollection({
          collectionSize: hits.length,
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

  return (
    <S.Container>
      <GlobalStyle />
      <Searchbar onSubmit={handleSubmitForm} />
      <ImageGallery ref={galleryRef} images={images} />
      {isVisibleBtn && <Button onLoadMore={handleLoadMore} />}
      {isLoading && <Loader />}
      <ToastContainer autoClose={5000} />
    </S.Container>
  );
};
