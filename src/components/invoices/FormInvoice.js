import React from 'react';

export default class FormInvoice extends React.Component {
	constructor(props) {
		super(props);
		this.id = props.id;
		this.state = {};
	}

	render() {
		return(
			<div className="modal fade" id={this.id} tabIndex="-1" role="dialog" aria-labelledby={`${this.id}Label`} aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id={`${this.id}Label`}>Modal title</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							Aquí debería haber un formulario 👀
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							<button type="button" className="btn btn-primary">Save changes</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}