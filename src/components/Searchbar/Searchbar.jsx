import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import * as S from './Searchbar.styled';
import { GoSearch } from 'react-icons/go';

const initialValues = {
  searchQuery: '',
};

const schema = yup.object().shape({
  searchQuery: yup.string().required(() => {
    toast.error('Enter something in the field.');
    toast.clearWaitingQueue();
  }),
});

export const Searchbar = ({ onSubmit }) => {
  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values);
    resetForm();
  };

  return (
    <S.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <S.SearchForm>
          <S.Button type="submit">
            <GoSearch />
            <S.Label>Search</S.Label>
          </S.Button>
          <S.Input
            type="text"
            name="searchQuery"
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
