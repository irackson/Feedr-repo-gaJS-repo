import './RemoveSourceForm.css';

function RemoveSourceForm(props) {
    const sources = props.sources;
    if (sources.length > 0) {
        if (props.justSubmitted === true) {
            return (
                <form onSubmit={props.removeSource}>
                    <div>
                        {sources.map((source, i) => (
                            <div key={i}>
                                <input
                                    type="checkbox"
                                    id={source}
                                    value={source || ''}
                                    onChange={props.updateClickability}
                                    checked={false}
                                />
                                <label htmlFor="src">{source}</label>
                            </div>
                        ))}
                    </div>
                    <input
                        type="submit"
                        value="Remove Source(s)"
                        disabled={props.disabled}
                    />
                </form>
            );
        } else {
            return (
                <form onSubmit={props.removeSource}>
                    <div>
                        {sources.map((source, i) => (
                            <div key={i}>
                                <input
                                    type="checkbox"
                                    id={source}
                                    value={source || ''}
                                    onChange={props.updateClickability}
                                />
                                <label htmlFor="src">{source}</label>
                            </div>
                        ))}
                    </div>
                    <input
                        type="submit"
                        value="Remove Source(s)"
                        disabled={props.disabled}
                    />
                </form>
            );
        }
    } else {
        return <p>You have no sources! There are no sources to remove.</p>;
    }
}

export default RemoveSourceForm;
