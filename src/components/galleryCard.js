//Карточка мероприятия

const GalleryCard = (props) => {//Props: data_event = {id, name, date, city, genre, image}, bool favorited
    const day = props.data_event.date.split(".")[0];//Получаем число месяца для карточки
    let loved = ""; 
    if (props.favorited) loved = "favorited"; //Название класса принадлежности к избранному
    return(
        <div key={props.id} className={"gallery__card card "+loved} style={{backgroundImage: `url(${props.data_event.image})`}}> 
            <div className="card_shadow"></div>           
            <div className="card__top">
                <div className="card__day">{day}</div>
                <button className="card__favorite" onClick={()=> props.callback(props.data_event.id)}></button>
            </div>
            <h3 className="card__title">
                {props.data_event.name} 
            </h3>          
        </div>
    );
}

export default GalleryCard;