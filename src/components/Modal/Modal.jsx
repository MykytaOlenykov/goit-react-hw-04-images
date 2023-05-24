import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import * as S from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ largeImgUrl, descr, onCloseModal }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  return createPortal(
    <S.Overlay onClick={handleBackdropClick}>
      <S.Content>
        <S.Image src={largeImgUrl} alt={descr} />
      </S.Content>
    </S.Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  largeImgUrl: PropTypes.string.isRequired,
  descr: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
