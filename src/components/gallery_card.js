//Карточка мероприятия

const Gallery__card = (props) => {//Props: data_event = {id, name, date, city, genre, image}, bool favorited
    return(
        <div>
            {props.data_event.id} / {props.data_event.name} / {props.data_event.city} / {props.data_event.date} / <button onClick={()=> props.callback(props.data_event.id)}>{"<3"}</button>
            
        </div>
    );
}

export default Gallery__card;