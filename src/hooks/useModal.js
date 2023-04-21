import { useState } from 'react';

export const useModal = defaultValue => {
  const [isOpenModal, setIsOpenModal] = useState(defaultValue);

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  return { isOpenModal, openModal, closeModal };
};
