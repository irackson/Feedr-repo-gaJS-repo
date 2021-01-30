function SourceSelector(props) {
    const sourceList = props.sourceList;

    return (
        <ul>
            {sourceList.map((name) => <li><a href="#" onClick={props.update}>{name}</a></li>)}
        </ul>
    )
}

export default SourceSelector; 