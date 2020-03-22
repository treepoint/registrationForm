import React from "react";
import RadioButtonCarousel from "../RadioButtonCarousel/RadioButtonCarousel";
import DatePickerButton from "../DatePickerButton/DatePickerButton";
import {
  getShortDayNameByID,
  getDDbyDate,
  getMMbyDate,
  getFormatDate,
  revokeDays
} from "../../Libs/TimeUtils";
import "./DayPickerCarousel.css";

class DayPickerCarousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { date: null };
  }

  componentDidMount() {
    let date = new Date();

    this.setState({ date }, () => this.getDaysMenu());
  }

  componentDidUpdate() {
    this.getDaysMenu();
  }

  //Обрабатываем нажатие с кнопок
  onClick(event) {
    this.setState({ date: event.target.name });
    this.props.onChange(getFormatDate(event.target.name));
  }

  //Обрабатываем выбор в DatePicker
  onPickDate(date) {
    this.setState({ date: date });
    this.props.onChange(getFormatDate(date));
  }

  getDaysMenu() {
    let date;
    let dayId;
    let dayLable;
    let daysMenu = [];
    let isPrimary = false;
    let isToday = false;
    let isHoliday = false;
    let today = new Date();

    let currentDay = new Date().getDay();
    let from;
    let to;

    /* Если день до среды — показываем текущую неделю и прошлую.
     * Поскольку, вероятно, нас больше интересуют старые данные, а не новая неделя.
     * Если же наступила среда — показываем текущую неделю + следующую.
     *
     * А для воскресенья вообще свой поворот
     */

    if (currentDay > 2) {
      from = -(12 - currentDay);
      to = 12 + from;
    } else if (currentDay === 0) {
      from = -(6 - 1);
      to = 6 + 1;
    } else {
      from = -(6 - currentDay);
      to = 6 + currentDay;
    }

    while (from < to) {
      date = new Date(revokeDays(today, from));
      dayId = date.getDay();

      //Если сегодня — укажем это
      if (getFormatDate(this.state.date) === getFormatDate(date)) {
        isPrimary = true;
      } else {
        isPrimary = false;
      }

      //Выделим выбранный день
      if (getFormatDate(today) === getFormatDate(date)) {
        isToday = true;
      } else {
        isToday = false;
      }

      //Выделим выходные
      if (dayId === 6 || dayId === 0) {
        isHoliday = true;
      } else {
        isHoliday = false;
      }

      dayLable = !!from
        ? getDDbyDate(date) +
          "." +
          getMMbyDate(date) +
          " " +
          getShortDayNameByID(dayId)
        : "Сегодня";

      //Добавим кнопки с датами
      daysMenu.unshift({
        name: date,
        key: from,
        isPrimary: isPrimary,
        isToday: isToday,
        isHoliday: isHoliday,
        value: dayLable,
        onClick: event => this.onClick(event)
      });

      from++;
    }

    return daysMenu;
  }

  render() {
    return (
      <div className="dayPickerCarousel">
        <RadioButtonCarousel items={this.getDaysMenu()} />
        <DatePickerButton
          onChange={date => this.onPickDate(date)}
          date={this.state.date}
          placeholderText="Выбрать дату"
          width={100}
        />
      </div>
    );
  }
}

export default DayPickerCarousel;