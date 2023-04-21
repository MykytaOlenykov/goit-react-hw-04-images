import PropTypes from 'prop-types';
import { useModal } from 'hooks';
import { Modal } from 'components/Modal';
import * as S from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ descr, imgUrl, largeImgURL }) => {
  const { isOpenModal, openModal, closeModal } = useModal(false);

  return (
    <S.Item>
      <S.Image src={imgUrl} alt={descr} onClick={openModal} />
      {isOpenModal && (
        <Modal
          largeImgUrl={largeImgURL}
          descr={descr}
          onCloseModal={closeModal}
        />
      )}
    </S.Item>
  );
};

ImageGalleryItem.propTypes = {
  descr: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  largeImgURL: PropTypes.string.isRequired,
};
