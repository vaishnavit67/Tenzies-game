export default function Die(props){
    return(
        <button className={props.isHeld ? "btn-click" : "btn"} onClick={props.handleClick}>{props.num}</button>
    );
}