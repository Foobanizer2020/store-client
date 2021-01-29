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
						Fatura #{this.state.numberInvoice}
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
						{this.state.content}
					</div>
				</div>
			</div>
		);
	}
}