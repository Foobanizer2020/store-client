import axios from 'axios';
import React from 'react';
import { api_uri } from '../../config';

export default class Invoice extends React.Component {
	api_uri = (path='') => api_uri(`/invoices${path}`)
	clicked = false;

	constructor(props) {
		super(props);
		this.state = {...props};
	}

	getFullData() {
		if (!this.clicked) {
			axios.get(this.api_uri(`/${this.state.id}`))
			.then(res => {
				this.setState({...res.data});
				this.clicked = true;
			});
		}
	}

	createContent(props) {
		const customer = props.customer;
		const payedWithCard = props.paymentMethod === 'CARD';
		return(
			<div className="row">
				<div className="col-6">
					<p><b>Número de factura:&nbsp;</b> {props.numberInvoice}</p>
					<p><b>Fecha de facturación:&nbsp;</b> {props.createAt}</p>
					<p><b>Descripción:&nbsp;</b> {props.description}</p>
					<b>Cliente:&nbsp;</b>
					<ul>
						<li>{customer.firstName}&nbsp;{customer.lastName}</li>
						<li>{customer.numberID}</li>
						<li>{customer.email}</li>
					</ul>
				</div>
				<div className="col-6">
					<p><b>Método de pago:&nbsp;</b> {payedWithCard ? 'Tarjeta' : 'Efectivo'}</p>
					{payedWithCard ? (<p><b>Tarjeta:&nbsp;</b> {'*'.repeat(12) + props.cardLastDigits}</p>) : null}
					<p><b>Total:&nbsp;</b> {'$' + props.subTotal}</p>
					{this.createItemsTable(props.items)}
				</div>
			</div>
		);
	}

	createItemsTable(items) {
		return(
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">Producto</th>
						<th scope="col">Precio</th>
						<th scope="col">Cantidad</th>
						<th scope="col">Subtotal</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<tr key={item.id}>
							<td>{item.product.name}</td>
							<td>{`$${item.price}`}</td>
							<td>{item.quantity}</td>
							<td>{`$${item.subTotal}`}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	}
	
	render () {
		return (
			<div className="card">
				<div className="card-header" id={`heading${this.state.id}`}>
					<h5 className="mb-0">
					<button
						className="btn btn-link collapsed" 
						data-toggle="collapse" 
						data-target={`#collapse${this.state.id}`} 
						aria-expanded="true" 
						aria-controls={`collapse${this.state.id}`}
						onClick={() => this.getFullData()}
					>
						Factura #{this.state.numberInvoice} ({this.state.createAt})
					</button>
					<button
						type="button"
						className="btn btn-danger float-right"
						onClick={() => this.state.handleDelete(this.state.id)}
					>
						Eliminar
					</button>
					</h5>
				</div>
				<div 
					id={`collapse${this.state.id}`} 
					className="collapse" 
					aria-labelledby={`heading${this.state.id}`} 
					data-parent={`#${this.state.parentId}`}
				>
					<div className="card-body">
						{this.state.customer ? this.createContent(this.state) : null}
					</div>
				</div>
			</div>
		);
	}
}