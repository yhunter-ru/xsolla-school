import { useState, useEffect} from 'react';
import GalleryCard from "./galleryCard"; //Карточка мероприятия

const months = [//Список месяцев для фильтров
    "All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const cities = [//Список городов для фильтров
    "All", "Amsterdam", "Berlin", "Rim", "St.Petersburg"
];

const Gallery = (props) => {
    const [data, setdata] = useState({eventsAll: [], events: [], city: "All", month: "00", liked: false, favorite: ""}); //Состояние списка мероприятий

    //Загрузка json
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/xsolla/xsolla-frontend-school-2021/main/events.json')
                .then(data => data.json())
                .then(events => setdata({eventsAll: events, events, city: "All", month: "00", liked: false, favorite: JSON.parse(window.localStorage.getItem("favorite"))}));
    }, []);

    //Установка фильтра для вывода списка мероприятий
    let setFilter = (data) => { 
        
        let eventsOutput = data.eventsAll;
        
        if (data.city!=='All') {//Фильтр по городу
            eventsOutput = eventsOutput.filter((a) => a.city===data.city);
        }
        if (data.month!=='00') {//Фильтр по месяцу         
            eventsOutput = eventsOutput.filter((a) => ((a.date.split(".")[1])===data.month));
        }
        if (data.liked) {//Фильтр по избранному
            if (data.favorite===null) eventsOutput=[]; //Проверяем, что список избранного не пуст
            else {
                eventsOutput = eventsOutput.filter((a) => data.favorite.indexOf(a.id)!==-1);
            }
            
        }

        setdata({eventsAll: data.eventsAll, events: eventsOutput, city: data.city, month: data.month, liked: data.liked, favorite: data.favorite});

    };

    //Фильтр города
    const setCityFilter = (_city) => {
        setFilter({eventsAll: data.eventsAll, events: data.events, city: _city, month: data.month, liked: data.liked, favorite: data.favorite});
    }

    //Фильтр месяца
    const setMonthFilter = (_month) => {
        setFilter({eventsAll: data.eventsAll, events: data.events, city: data.city, month: _month, liked: data.liked, favorite: data.favorite});
    }

    //Фильтр избранного
    const setLikedFilter = () => {
        let _liked = false;
        if (!data.liked) _liked=true;
        setFilter({eventsAll: data.eventsAll, events: data.events, city: data.city, month: data.month, liked: _liked, favorite: data.favorite});
    }

    const favorite_callBack = (_id) => {//Добавление и удаление из избранного
        let copy = [];

        if (data.favorite!==null) {//Если избранное не пустое, берем данные из него
            copy=data.favorite;
        }

        let favorite_search = copy.indexOf(_id); //Ищем id мероприятия в избранном

        if (favorite_search===-1) copy.push(_id);  //Если нет в избранном - добавляем                   
        else copy.splice(favorite_search, 1);   //Если уже есть в избранном - удаляем 

        //setFavorite(copy); //Записываем изменения в состояние
        window.localStorage.setItem("favorite", JSON.stringify(copy)); //Записываем изменения в хранилище
        setdata({eventsAll: data.eventsAll, events: data.events, city: data.city, month: data.month, liked: data.liked, favorite: copy}); //Обновляем состояние        
    }

    //Вывод мероприятий
    const data_output = (props) => {
        let output = [];
        
        //Cортируем по дате
        const sortedEvents = props.sort((a, b) => parseInt(a.date.split(".").reverse().join('')) > parseInt(b.date.split(".").reverse().join('')) ? 1 : -1); 

        if (sortedEvents.length===0) {//Если нет мероприятий
            output.push(
                <div key="noevents" className="gallery__noEvents">No events</div>
            );
        }

        else {
            //Выводим список мероприятий
            sortedEvents.map(( event, index ) => {              
                let favorited = false;
                if (data.favorite !== null) {
                    if (data.favorite.indexOf(event.id)!==-1) favorited=true; //Проверяем, есть ли мероприятие в массиве избранных
                }                
                if (data.month==='00') {//Если показываем все месяцы, то будем выводить их названия
                    let _month = event.date.split(".")[1];
                    const _monthOutput = () => { //Функция вывода названия месяца
                        output.push(<h3 key={months[parseInt(_month)]} className="gallery__monthSeparator">{months[parseInt(_month)]}</h3>);
                    }                    
                    if (index===0) { //Перед паервым мероприятием выводим название месяца
                        _monthOutput();
                    }
                    else {
                        if (_month!==sortedEvents[index-1].date.split(".")[1]) { //Перед мероприятиями с повторяющимся месяцем выводим название месяца
                            _monthOutput(); 
                        }
                    }
                }
                
                output.push(                    
                    <GalleryCard key={event.id} data_event={event}  favorited={favorited} callback={favorite_callBack} />                    
                ); 
                return null;              
            }
        );
        }

        
        return (output);
    }

    let likedClass = "";
    if (data.liked) likedClass="favorited";
    
    return(
        <div className="page">     
            <h1 className="page__header">Event Listing</h1>
            <div className="page__content gallery">
                <div className="gallery__filters filters">
                    <div className="filters__selectors">
                        <div className="filters__city">
                            <label htmlFor="filters__city">City:</label>
                            <select name="filters__city" id="filters__city"             
                                onChange={e => setCityFilter(e.target.value)}
                            >
                                {cities.map(( city ) => {//Выводим список фильтра городов                                                        
                                    return(
                                        <option key={city} value={city}>{city}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="filters__month">
                            <label htmlFor="filters__month">Month:</label>
                            <select name="filters__month" id="filters__month"
                                onChange={e => setMonthFilter(e.target.value)}
                            >
                                {months.map(( month, index ) => { //Выводим список фильтра месяцев  
                                    let _monthIndex = index;
                                    if (_monthIndex<10) _monthIndex="0"+_monthIndex; //Добавляем 0 для номера месяца <10
                                    return(
                                        <option key={month} value={_monthIndex}>{month}</option>
                                    );
                                })}
                            </select> 
                        </div>
                         
                    </div> 
                    <button title="Favorite" className={"filters__favorite "+likedClass} onClick={() => {setLikedFilter()}}></button>   
                </div>           
                
                {data_output(data.events)}
            </div>
        </div>
    );
}

export default Gallery;