import React from 'react';
import { api_uri } from '../../config';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

export default class FormInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.id = props.id;
		this.state = {
			products: [],
			customers: [],
			cards: [],
			numberInvoice: "",
			customerId: "",
			cardId: "",
			paymentMethod: "CASH",
			productsInList: []
		};
		this.handleCreate = props.handleCreate;
	}

	componentDidMount() {
		this.getProducts();
		this.getCustomers();
	}

	getProducts() {
		axios.get(api_uri('/products'))
		.then(res => {
			const products = res.data;
			this.setState({products});
		});
	}

	getCustomers() {
		axios.get(api_uri('/customers'))
		.then(res => {
			const customers = res.data;
			this.setState({customers});
			this.setState({customerId: customers[0].id});
			this.getCards(customers[0].id);
		});
	}

	getCards(id) {
		axios.get(api_uri(`/cards?customerId=${id}`))
		.then(res => {
			const cards = res.data;
			this.setState({cards});
		})
		.catch(error => {
			if (error.response.status === 404) {
				this.setState({cards: []});
				return;
			}
			return Promise.reject(error.response);
		});
	}

	handleUpdateCustomerId(id) {
		this.getCards(id);
		this.setState({customerId: id});
	}

	handleCheckProduct(status, id) {
		if (status) {
			let product;
			this.state.products.forEach(p => {if (p.id === id) {product = p}});
			const productsInList = [...this.state.productsInList, {productId: product.id, quantity: 1, price: product.price}];
			this.setState({productsInList});
		} else {
			const productsInList = this.state.productsInList.filter(p => p.productId !== id);
			this.setState({productsInList});
		}
	}

	handleAddInvoice() {
		let invoice = {
			numberInvoice: this.state.numberInvoice,
			customerId: this.state.customerId,
			description: this.state.description,
			items: this.state.productsInList,
			paymentMethod: this.state.paymentMethod
		};
		if (invoice.paymentMethod === 'CARD') {
			invoice = {...invoice, cardId: this.state.cardId};
		}
		axios.post(api_uri('/invoices'), invoice)
		.then(res => {
			this.handleCreate();
			this.setState({
				description: "",
				numberInvoice: "",
				customerId: "",
				cardId: "",
				paymentMethod: "CASH",
				productsInList: []
			});
			$("#" + this.id).modal("hide");
			Swal.fire({
				icon: 'success',
				title: '¡Factura creada!',
				showConfirmButton: false,
				timer: 1000
			});
		});
	}

	render() {
		return(
			<div className="modal fade" id={this.id} tabIndex="-1" role="dialog" aria-labelledby={`${this.id}Label`} aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title" id={`${this.id}Label`}>Agregar Factura</h3>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<form>
								<div className="form-group">
									<label htmlFor="numberInvoice">Número de factura</label>
									<input type="text" className="form-control" id="numberInvoice" placeholder="0000XX" value={this.state.numberInvoice} onChange={(e) => this.setState({numberInvoice: e.target.value})} />
								</div>

								<div className="form-group">
									<label htmlFor="description">Descripción</label>
									<textarea className="form-control" id="description" rows="3" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}></textarea>
								</div>
								
								<fieldset className="form-group">
									<div className="row">
										<legend className="col-form-label col-sm-2 pt-0">Productos</legend>
										<div className="col-sm-10">
											{this.state.products.map(p => (
												<div className="custom-control custom-checkbox" key={p.id}>
													<input className="custom-control-input" id={p.id} type="checkbox"
														onChange={(e) => this.handleCheckProduct(e.target.checked, p.id)}	
													/>
													<label className="custom-control-label" htmlFor={p.id}>
														{p.name}: &nbsp; ${p.price}
													</label>
												</div>
											))}
										</div>
									</div>
								</fieldset>

								<div className="form-group">
									<label htmlFor="customerId">Cliente</label>
									<select className="form-control" id="customerId" 
										value={this.state.customerId} 
										onChange={(e) => this.handleUpdateCustomerId(e.target.value)}
									>
										{this.state.customers.map(c => (
											<option value={c.id} key={c.id}>{c.firstName + ' ' + c.lastName}</option>
										))}
									</select>
								</div>

								<div className="row">
									<div className="form-group col">
										<label htmlFor="customerId">Método de pago</label>
										<div className="custom-control custom-radio">
											<input type="radio" id="card" name="customRadio" className="custom-control-input" 
												onChange={(e) => {if (e.target.checked) {this.setState({paymentMethod: 'CARD'})}}}
												checked={this.state.paymentMethod === "CARD"}
												disabled={this.state.cards.length === 0}
											/>
											<label className="custom-control-label" htmlFor="card">Tarjeta</label>
										</div>
										<div className="custom-control custom-radio">
											<input type="radio" id="cash" name="customRadio" className="custom-control-input" 
												onChange={(e) => {if (e.target.checked) {this.setState({paymentMethod: 'CASH'})}}}
												checked={this.state.paymentMethod === "CASH"}
											/>
											<label className="custom-control-label" htmlFor="cash">Efectivo</label>
										</div>
									</div>
									<div className="form-group col">
										<label htmlFor="cardId">&nbsp;</label>
										<select className="form-control" id="cardId" value={this.state.cardId} 
											onChange={(e) => {this.setState({cardId: e.target.value}); console.log(e.target.value);}} 
											disabled={this.state.paymentMethod === 'CASH'}
										>
											{this.state.cards.map(c => (
												<option value={c.id} key={c.id}>{c.number}</option>
											))}
										</select>
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
							<button type="button" className="btn btn-primary" onClick={() => this.handleAddInvoice()}>Agregar</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}