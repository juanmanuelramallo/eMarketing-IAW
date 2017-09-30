import React from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import { Button, Icon , ProgressBar, Input, Row, Col } from 'react-materialize';
import ContactIndex from './ContactIndex';
import $ from 'jquery';
import { notify } from 'react-notify-toast';

class ContactsIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      contactos: []
    }
  }


  fetchContactos() {
    this.setState({
      isLoading: true
    });

    // The following method fetchs the contacts from an API and uses promises and callbacks implemented by jQuery
    $.ajax({
      url: 'http://localhost:3000/v1/contacts',
      method: 'get'
    })
      .done(response => {
        this.setState({
          contactos: response,
          isLoading: false,
          error: false
        });
      })
      .fail(response => {
        this.setState({
          isLoading: false,
          error: true
        })
      })
  }


  componentDidMount() {
    this.fetchContactos();
  }


  handleSearchChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


	buscarContacto() {
    this.setState({
      isLoading: true
    });
    const { email, name, tags } = this.state;
    const data = {
      email,
      name,
      tags
    };
    $.ajax({
      url: 'localhost:5000/api/v1/contacts/search',
      method: 'POST',
      data: data
    })
      .done(response => {
        this.setState({
          isLoading: false,
          contactos: response,
        })
      })
      .fail(response => {
        notify.show('Ocurrió un error inesperado al buscar el contacto', 'error');
        this.setState({
          isLoading: false,
        })
      })
	}


  renderContacto(contacto) {
    return(
      <ContactIndex contacto={ contacto } key={ contacto.id }/>
    );
  }


  renderBuscarContacto() {

    return(
      <div className="buscar-contacto">
        <h5>Buscar contacto</h5>
        <Input type="text" name="name" label="Nombre" onChange={ (e) => this.handleSearchChange(e) } />
        <Input type="text" name="email" label="Email" onChange={ (e) => this.handleSearchChange(e) } />
        <Input type="text" name="tags" label="Etiquetas" onChange={ (e) => this.handleSearchChange(e) } />
        <Button className="blue-grey darken-1" onClick={ () => this.buscarContacto() }>Buscar</Button>
      </div>
    )
  }

  render() {
    const { contactos, isLoading, error } = this.state;
  	return(
			<div className='contactos'>
				<Header
					title="Contactos"
					back="/" />
				<div className="container">
          <Row className="acciones">
            <Input s={12} m={6} type="select" name="ordenar" id="ordenar" defaultValue="">
              <option value="">Ordenar por ...</option>
              <option value="nombre">Nombre</option>
              <option value="email">Email</option>
            </Input>
            <Col s={12} m={6}>
              <Link to="/contactos/etiquetas" className="btn etiquetas blue-grey darken-1">Gestionar etiquetas</Link>
            </Col>
          </Row>

          <Row>
            <Col s={12} m={8}>
              {
                isLoading ?
                  <div className="center">
                    <ProgressBar />
                  </div>
                :
                  contactos.map(this.renderContacto)
              }
            </Col>
            <Col s={12} m={4}>
              { this.renderBuscarContacto() }
            </Col>
          </Row>
					<Button floating large className='fixed-action-btn'><Link to='/contactos/nuevo'><Icon>add</Icon></Link></Button>
				</div>
  		</div>
		);
  }
}

export default ContactsIndex;
