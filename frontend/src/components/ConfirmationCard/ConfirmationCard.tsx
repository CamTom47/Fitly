import React from "react";

import "./ConfirmationCard.css";

interface ConfirmationCardProps {
	toggle: () => void;
	confirm: () => void;
	message: String;
}

const ConfirmationCard = ({ toggle, confirm, message }: ConfirmationCardProps): React.JSX.Element => {
	const handleConfirmation = () => {
		confirm();
		toggle();
	};
	return (
		<div className='ConfirmationCard-container'>
			<div className='ConfirmationCard-body'>
				<div className='ConfirmationCard-content'>
					<p>{message}</p>
					<div>
						<button onClick={toggle}>Cancel</button>
						<button onClick={handleConfirmation}>Confirm</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationCard;
