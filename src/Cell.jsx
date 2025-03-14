export default function Cell( {entry}) {

    let text = "cell-container";

    entry != 0 ?  text += " zoom" : text += "";

    text+= " n" + entry;

    return (
        <div className={text}>
            <div className="cell"> {entry != 0 ? entry : ""} </div>
        </div>
    )
}