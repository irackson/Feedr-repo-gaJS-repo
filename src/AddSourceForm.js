import './AddSourceForm.css';

function AddSourceForm(props) {
	const sources = props.sources;
	if (sources.length > 0) {
		return (
			<form onSubmit={props.addSource}>
				<div>
					{sources.map((source) => (
						<div>
							<input type='checkbox' id={source} value={source} />
							<label htmlFor='src'>{source}</label>
						</div>
					))}
				</div>
				<input type='submit' value='Add Source(s)' />
			</form>
		);
	} else {
		return <p>You have all the sources! There are no sources to add.</p>;
	}
}

export default AddSourceForm;
