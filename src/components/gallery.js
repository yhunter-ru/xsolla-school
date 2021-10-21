//Галерия мероприятий
import { useState} from 'react';
import Gallery__card from "./gallery_card"; //Карточка мероприятия

const Gallery = (props) => { //Props: data = []
    const gallery_data = props.data.sort((a, b) => parseInt(a.date.split(".").reverse().join('')) > parseInt(b.date.split(".").reverse().join('')) ? 1 : -1); //Список мероприятий, сортируем по дате

    const [events, setEvents] = useState({"list": gallery_data, "city": "all", "month": "all"}); //Состояние списке мероприятий и фильтров на нем
    
    const setFilter = (events) => { //Установка состояния для вывода списка мероприятий
        let eventsOutput = gallery_data;
        
        if (events.city!=='all') {//Фильтр по городу
            eventsOutput = eventsOutput.filter((a) => a.city===events.city);
        }
        if (events.month!=='all') {//Фильтр по месяцу         
            eventsOutput = eventsOutput.filter((a) => ((a.date.split(".")[1])===events.month));
        }        
        setEvents({"list": eventsOutput, "city": events.city, "month": events.month});
        //console.log(eventsOutput);
    };
    const setCityFilter = (_city) => {
        setFilter({"list": events.list, "city": _city, month: events.month});
        //console.log(_city);
    }
    const setMonthFilter = (_month) => {
        setFilter({"list": events.list, "city": events.city, month: _month});
        //console.log(_month);
    }

    const [favorite, setFavorite] = useState(JSON.parse(window.localStorage.getItem("favorite")));

    const favorite_callBack = (_id) => {
        let copy = [];
        if (favorite!==null) {
            copy=favorite;
        }
        if ()
        copy.push(_id);
        setFavorite(copy);
        window.localStorage.setItem("favorite", JSON.stringify(copy));
        console.log(favorite);
    }


    const output_data = events.list.map(( event, index ) => {//Парсим список мероприятий полученный в пропсах
            return(
                <Gallery__card key={ index.toString() } data_event={event} callback={favorite_callBack} />
            );
        }
    );
    
    
    return (
        <div>
            gallery:
            <select name="city_filter"              
                onChange={e => setCityFilter(e.target.value)}
            >
                <option value="all" defaultValue>All</option>
                <option value="Amsterdam">Amsterdam</option>
                <option value="Berlin">Berlin</option>
            </select>

            <select name="month_filter"
                onChange={e => setMonthFilter(e.target.value)}
            >
                <option value="all" defaultValue>All</option>
                <option value="09">September</option>
                <option value="08">August</option>
            </select>

            {output_data}
        </div>
    );
}

export default Gallery;