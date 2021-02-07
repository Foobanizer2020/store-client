import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import { api_uri } from '../../config';
import FormInvoice from './FormInvoice';
import Invoice from './Invoice';

export default class InvoicesView extends React.Component {
	api_uri = (path='') => api_uri(`/invoices${path}`);

	constructor(props) {
		super(props);
		this.state = {
			invoices: []
		};
	}

	deleteInvoice(id) {
		axios.delete(this.api_uri(`/${id}`))
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
		axios.get(this.api_uri('?state=CREATED'))
			.then(res => {
				const invoices = res.data;
				this.setState({invoices});
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
					</h3>
					<FormInvoice handleCreate={() => this.getInvoices()} id={formId}/>
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