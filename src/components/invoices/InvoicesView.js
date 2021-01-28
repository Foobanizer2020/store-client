import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import { api_uri } from '../../config';
import FormInvoice from './FormInvoice';
import Invoice from './Invoice';

export default class InvoicesView extends React.Component {
	api_uri = (path='') => api_uri(`invoices/${path}`);

	constructor(props) {
		super(props);
		this.state = {
			// TODO: Eliminar datos de prueba
			invoices: [
				{"id": 1, "content": "Datos de la primera factura", "title": "Factura 1"},
				{"id": 2, "content": "Datos de la segunda factura", "title": "Factura 2"},
				{"id": 3, "content": "Datos de la tercera factura", "title": "Factura 3"},
			]
		};
	}

	deleteInvoice(id) {
		axios.delete(this.api_uri(id))
			.then(res => {
				this.getInvoices();
				Swal.fire({
					icon: 'success',
					title: '¡Factura eliminada!',
					showConfirmButton: false,
					timer: 1000
				});
			});
	}
	
	componentDidMount() {
		this.getInvoices();
	}

	getInvoices() {
		axios.get(this.api_uri())
			.then(res => {
				const invoices = res.data;
				this.setState({invoices})
				console.log(invoices);
			});
	}

	render() {
		const accordionId = "accordion-invoices";
		const invoices = this.state.invoices.map(i => 
			<Invoice 
				{...i}
				key={i.id} 
				parentId={accordionId} 
				handleDelete={(id) => this.deleteInvoice(id)}
			/>
		);

		const formId = "form-invoice-modal";

		return (
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">
						Facturas: 
						<button 
							type="button" 
							className="btn btn-success float-right"
							data-toggle="modal" 
							data-target={`#${formId}`}
						>
							Agregar factura
						</button>
						<FormInvoice handleCreate={() => this.getInvoices()} id={formId}/>
					</h3>
				</div>
				<div className="card-body">
					<div id={accordionId}>
						{invoices}
					</div>
				</div>
			</div>
		);
	}
}