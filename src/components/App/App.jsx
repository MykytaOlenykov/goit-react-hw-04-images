import { Component } from 'react';
import { GlobalStyle } from 'components/GlobalStyle';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Container } from './App.styled';

export class App extends Component {
  state = {
    images: [],
  };

  handleSubmitForm = values => {
    const searchQuery = values.searchQuery.trim().toLowerCase();

    if (!searchQuery.length) {
      return;
    }

    console.log(searchQuery);
  };

  render() {
    return (
      <Container>
        <GlobalStyle />
        <Searchbar onSubmit={this.handleSubmitForm} />
        <ImageGallery />
      </Container>
    );
  }
}
