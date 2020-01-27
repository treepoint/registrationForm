import React from "react";
import uuid from "uuid/v4";
import { Resizable } from "re-resizable";
import TextContent from "../../TextContent/TextContent";
import SelectContent from "../../SelectContent/SelectContent";
import TimeContent from "../../TimeContent/TimeContent";
import "./Cell.css";

class Cell extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      uuid: "",
      value: " ",
      //Тип контента
      type: "",
      //Стиль оформления контента
      bold: false,
      italic: false,
      backgroundColor: "#f7f7f7",
      //Активность
      disabled: true,
      //Возможность стилизации
      isStylable: false
    };
  }

  componentDidMount() {
    //Генерируем UUID для ячейки
    this.setState({ uuid: uuid() });

    //Задаем тип контента, пока только при инициализации
    this.updateTypeContent();

    //Задаем редактируемость контента, пока только при инициализации
    this.updateContentDisabled();

    //Задаем стиль контента
    this.updateStyleContent();

    //Обновляем значение в ячейке
    this.updateValue();
  }

  componentDidUpdate() {
    //Задаем стиль контента
    this.updateStyleContent();

    //Обновляем значение в ячейке
    this.updateValue();
  }

  //Задаем тип контента
  updateTypeContent() {
    if (typeof this.props.content.type !== "undefined") {
      this.setState({ type: this.props.content.type });
    }
  }

  //Задаем редактируемость контента
  updateContentDisabled() {
    if (typeof this.props.content.disabled !== "undefined") {
      this.setState({ disabled: this.props.content.disabled });
    }
  }

  //Обновляем значение в ячейке
  updateValue() {
    if (typeof this.props.content !== "undefined") {
      let value = this.props.content.value;

      //Если тип поля — текст, то на всякий случай конвертим в текст
      if (
        this.props.content.type === "text" ||
        this.props.content.type === "string"
      ) {
        value = String(value);
      }

      if (value !== this.state.value) {
        this.setState({ value });
      }
    }
  }

  //Задаем стиль контента
  updateStyleContent() {
    if (typeof this.props.content.style === "undefined") {
      return null;
    }

    if (!this.state.isStylable) {
      this.setState({ isStylable: true });
    }

    //Обновим жирность
    let bold = this.props.content.style.bold;

    //Заполняем его параметрами. Если пришел из вне — ставим его, иначе из текущего стиля
    if (typeof bold !== "undefined" && bold !== this.state.bold) {
      this.setState({ bold });
    }

    //Обновим курсив
    let italic = this.props.content.style.italic;

    if (typeof italic !== "undefined" && italic !== this.state.italic) {
      this.setState({ italic });
    }

    //Обновим цвет фона
    let backgroundColor = this.props.content.style.backgroundColor;

    if (
      typeof backgroundColor !== "undefined" &&
      backgroundColor !== this.state.backgroundColor
    ) {
      this.setState({ backgroundColor });
    }
  }

  //Задаем возможность изменяться
  setEnabled() {
    if (this.props.isResizeble) {
      return {
        top: false,
        right: true,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      };
    } else {
      return {
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      };
    }
  }

  //Обрабатываем изменения стиля контента в ячейке
  onChangeStyle(style) {
    this.props.onChangeStyle({ style });
  }

  //Обрабатываем изменения контента в ячейке
  onChangeValue(content) {
    this.props.onChangeValue(content);
  }

  //Обрабатываем изменение размеров
  changeDimensions(width, height) {
    if (!this.props.isResizeble) {
      return;
    }

    ///Отправляем uuid ячейки, которая меняет всех
    if (this.props.uuid === "") {
      this.props.changeUUID(this.state.uuid);
    }

    //Если сейчас изменяется не эта ячейка — размеры никуда не прокидываем
    if (this.props.uuid !== this.state.uuid) {
      return;
    }

    //Если что-то поменялось и это не высота, значит длина
    if (height !== 0) {
      this.props.changeHeight(height);
    } else {
      this.props.changeWidth(width);
    }
  }

  getCellContent() {
    switch (this.state.type) {
      //Время в формате 00:00
      case "time":
        return (
          <TimeContent
            value={this.state.value}
            isHeader={this.props.isHeader}
            disabled={this.state.disabled}
            width={this.props.width}
            height={this.props.height}
            onChangeValue={value => this.onChangeValue(value)}
          />
        );
      //Строки
      case "string":
        return (
          <TextContent
            isFixed={this.props.isFixed}
            value={this.state.value}
            isHeader={this.props.isHeader}
            disabled={this.state.disabled}
            width={this.props.width}
            height={this.props.height}
            isStylable={this.state.isStylable}
            isSingleLineMode={true}
            //Настройки стиля
            bold={this.state.bold}
            italic={this.state.italic}
            backgroundColor={this.state.backgroundColor}
            //Функции
            onChangeStyle={style => {
              this.onChangeStyle(style);
            }}
            onChangeValue={value => this.onChangeValue(value)}
          />
        );
      //Многострочный текст
      case "text":
        return (
          <TextContent
            isFixed={this.props.isFixed}
            value={this.state.value}
            isHeader={this.props.isHeader}
            disabled={this.state.disabled}
            width={this.props.width}
            height={this.props.height}
            isStylable={this.state.isStylable}
            //Настройки стиля
            bold={this.state.bold}
            italic={this.state.italic}
            backgroundColor={this.state.backgroundColor}
            //Функции
            onChangeStyle={style => {
              this.onChangeStyle(style);
            }}
            onChangeValue={value => this.onChangeValue(value)}
          />
        );
      //Выпадающий список
      case "select":
        return (
          <SelectContent
            value={this.state.value}
            disabled={this.state.disabled}
            width={this.props.width}
            height={this.props.height}
            onChangeValue={value => this.onChangeValue(value)}
          />
        );

      default:
        return;
    }
  }

  render() {
    //Если тип контента — скрытый, вообще ничего не рисуем
    if (this.state.type === "hidden") {
      return null;
    }

    return (
      <Resizable
        className={!!this.props.isHeader ? "th" : "td"}
        //Выставляем размеры ячейки
        size={{
          width: this.props.width + "px",
          height: this.props.height + 1 + "px"
        }}
        //Задаем минимальную высоту
        minHeight={35}
        minWidth={20}
        //Указываем какие грани ячейки активны для изменения размеров
        enable={this.setEnabled()}
        //При резайзе отправляем размеры вверх, в строку
        onResize={(e, direction, ref, d) => {
          this.changeDimensions(d.width, d.height);
        }}
        //Если закончили ресайз — прокинем событие выше. Столбец на
        //основании этого при следующем резайзе будет считать размеры заново
        onResizeStop={() => {
          this.props.stopChangeDimensions();
        }}
      >
        {this.getCellContent()}
      </Resizable>
    );
  }
}

export default Cell;
