import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalStyle } from 'components/GlobalStyle';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Container } from './App.styled';

export class App extends Component {
  state = {
    searchQuery: '',
  };

  handleSubmitForm = values => {
    const searchQuery = values.searchQuery.trim().toLowerCase();

    if (!searchQuery.length) {
      toast.error('Enter valid value.');
      return;
    }

    this.setState({ searchQuery });
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <Container>
        <GlobalStyle />
        <Searchbar onSubmit={this.handleSubmitForm} />
        <ImageGallery imgName={searchQuery} />
        <ToastContainer autoClose={3000} limit={1} />
      </Container>
    );
  }
}
