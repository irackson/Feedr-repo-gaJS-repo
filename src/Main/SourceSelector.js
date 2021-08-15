function SourceSelector(props) {
    const sourceList = props.sourceList;

    return (
        <ul>
            {sourceList.map((name, i) => (
                <li key={i}>
                    <button
                        className="link-to-button"
                        href="#"
                        onClick={props.update}
                    >
                        {name}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default SourceSelector;
