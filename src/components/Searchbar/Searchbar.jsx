import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as S from './Searchbar.styled';
import { GoSearch } from 'react-icons/go';

export const Searchbar = ({ onSubmit }) => {
  const handleSubmit = (values, { resetForm }) => {
    const imgName = values.imgName.trim().toLowerCase();

    if (!imgName.length) {
      toast.error('Enter something in the field.');
      resetForm();

      return;
    }

    onSubmit(imgName);
    resetForm();
  };

  return (
    <S.Header>
      <Formik initialValues={{ imgName: '' }} onSubmit={handleSubmit}>
        <S.SearchForm>
          <S.Button type="submit">
            <GoSearch />
            <S.Label>Search</S.Label>
          </S.Button>
          <S.Input
            type="text"
            name="imgName"
            autoComplete="off"
            placeholder="Search images and photos"
          />
        </S.SearchForm>
      </Formik>
    </S.Header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
