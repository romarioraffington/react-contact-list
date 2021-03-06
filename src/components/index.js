// External Dependencies
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// Our Dependencies
import ListContainer from './ListContainer';
import ContactForm from './ContactForm';
import * as ContactsAPI from '../services/ContactsAPI';

class App extends Component {
  state = {
    contacts: [],
  }

  componentDidMount() {
    ContactsAPI.getAll().then(contacts => {
      this.setState({ contacts });
    });
  }

  createContact(contact) {
    ContactsAPI.create(contact).then(data => {
      if (data.error) {
        return alert(data.error);
      }
      this.setState(state => ({
        contacts: state.contacts.concat(data.contact)
      })); 
    });
  };

  editContact(contact) { 
    ContactsAPI.update(contact).then(data => {
      if (data.error) {
        return alert(data.error);
      }
      this.setState(({ contacts }) => ({
        contacts: contacts.map(c => (
          c.id === contact.id ? contact : c
        ))
      }));
    });     
  }

  deleteContact = (contact) => {
    ContactsAPI.remove(contact).then(res => {
      if (res.status === 204) {
        this.setState(({ contacts }) => ({
          contacts: contacts.filter(c => c.id !== contact.id)
        }));
      } else {
        console.log(res.body);
        alert('Oops! Could not delete contact');
      }
    });
  }

  render() {
    return (
      <div className='app'>
        <Route exact path='/' render={({ history }) => (
          <ListContainer
            contacts={this.state.contacts}
            onDeleteContact={this.deleteContact}
            onContactClick={(contact) => {
              history.push('/edit', {
                contact
              });
            }}
          />
        )} />

        <Route path='/create' render={({ history }) => (
          <ContactForm
            headerText='Create'
            buttonText='Create'
            onCreateContact={contact => {
              this.createContact(contact)
              history.push('/')
            }}
          />
        )} />

        <Route path='/edit' render={({ history }) => (
          <ContactForm
            headerText='Edit'
            buttonText='Save'
            contact={history.location.state.contact}
            onEditContact={contact => {
              this.editContact(contact)
              history.push('/')
            }}
          />
        )} />
      </div>
    )
  }
}

export default App;