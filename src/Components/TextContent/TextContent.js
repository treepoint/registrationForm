import React from "react";
//Подключаем redux
import { connect } from "react-redux";
//Подключаем компоненты
import TextareaAutosize from "react-autosize-textarea";
import ContextMenu from "./ContextMenu/ContextMenu";
import WideEditAreaBlur from "./WideEditAreaBlur/WideEditAreaBlur";
import "./TextContent.css";

class TextContent extends React.Component {
  constructor() {
    super();
    this.state = {
      contextMenuIsHidden: true,
      wideEditAreaIsHidden: true,
      value: "",
      isReadOnly: false
    };
  }

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  componentDidUpdate() {
    if (this.state.value !== this.props.value && !this.state.isReadOnly) {
      this.setState({ value: this.props.value });
    }
  }

  onFocus() {
    this.setState({ isReadOnly: true });
  }

  //Изменяем контент по вводу
  onChange(event) {
    let value = event.target.value;

    if (this.props.isSingleLineMode) {
      value = value.replace(/\n/g, "");
    }

    this.setState({ value });
  }

  onKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      this.props.onChangeValue(this.state.value);
      this.setWideEditAreaHidden();
      this.setState({ isReadOnly: false });
    }
  }

  onBlur() {
    if (this.state.value !== this.props.value) {
      this.props.onChangeValue(this.state.value);
    }

    this.setWideEditAreaHidden();
    this.setState({ isReadOnly: false });
  }

  //Обрабатываем изменения стиля контента в ячейке в
  //зависимости от того, что было задано в контекстном меню
  onChangeStyle(style) {
    this.props.onChangeStyle(style);
  }

  //Срабатывает при вызове контекстного меню
  showContextMenu(event) {
    //Если не отключена возможно редактировать контент, и не отключена стилизация
    if (
      !this.props.disabled &&
      !!this.props.isStylable &&
      !this.props.isHeader
    ) {
      event.stopPropagation();
      event.preventDefault();
      this.setState({ contextMenuIsHidden: !this.state.contextMenuIsHidden });
    }
  }

  hideAllEditing() {
    //Скроем контекстное меню
    this.setContextMenuHidden();
    //Скроем большую форму редактирования
    this.setWideEditAreaHidden();
  }

  //Скроем контекстное меню
  setContextMenuHidden() {
    this.setState({
      contextMenuIsHidden: true
    });
  }

  //Скроем большую форму редактирования
  setWideEditAreaHidden() {
    this.setState({
      wideEditAreaIsHidden: true
    });
  }

  //Получаем стиль ячейки заголовка на основании стиля контента
  getHeaderStyle() {
    let style;

    //Вот такого делать никогда не нужно. Но если очень хочется — все равно не надо
    //Они держат мою жену в заложниках и сказали сделать быстро, поэтому так

    let isChrome = false;

    if (navigator.userAgent.indexOf("Chrome") + 1) {
      isChrome = true;
    }

    style = {
      fontWeight: "900",
      width: this.props.width - (!!isChrome ? 9 : 8) + "px",
      height: this.props.height - 13 + "px",
      minWidth: this.props.width - (!!isChrome ? 9 : 8) + "px",
      minHeight: this.props.height - 13 + "px",
      color: "#000"
    };

    return style;
  }

  //Получаем стиль обычной ячейки на основании стиля контента
  getRegularStyle() {
    //Вот такого делать никогда не нужно. Но если очень хочется — все равно не надо
    //Они держат мою жену в заложниках и сказали сделать быстро, поэтому так

    let isChrome = false;

    if (navigator.userAgent.indexOf("Chrome") + 1) {
      isChrome = true;
    }

    return {
      //Подгоняем размеры внутреннего контента по размеры ячейки, но компенсируем отступы и бордюры
      marginLeft: !!this.state.wideEditAreaIsHidden
        ? 0 + "px"
        : -(!!this.props.isFixed ? 0 : this.props.scrollLeft) + "px",
      marginTop: !!this.state.wideEditAreaIsHidden
        ? 0 + "px"
        : -(!!this.props.isFixed ? 0 : this.props.scrollTop) + "px",
      width: !!this.props.isStylable
        ? this.props.width - (!!isChrome ? 17 : 16) + "px"
        : this.props.width - (!!isChrome ? 9 : 8) + "px",
      height: this.props.height - (!!isChrome ? 16 : 12) + "px",
      backgroundColor: !!this.props.disabled ? "rgb(251, 251, 251)" : "#ffffff",
      borderLeft: "8px solid " + this.props.style.backgroundColor,
      fontWeight: !!this.props.style.bold ? "900" : "200",
      fontStyle: !!this.props.style.italic ? "italic" : "normal",
      color: !!this.props.disabled ? "#444" : "#000",
      minWidth: !!this.props.isStylable
        ? this.props.width - (!!isChrome ? 17 : 16) + "px"
        : this.props.width - (!!isChrome ? 9 : 8) + "px",
      minHeight: this.props.height - (!!isChrome ? 4 : 0) + "px"
    };
  }

  //Срабатывает при двойном клике
  showWideEditArea(event) {
    if (this.props.disabled || this.props.isHeader) {
      return;
    }

    this.setState({
      wideEditAreaIsHidden: false,
      contextMenuIsHidden: true
    });
  }

  getClassName() {
    let className = "textContent";
    if (!this.state.wideEditAreaIsHidden) {
      className = className + " chosen";
    }
    return className;
  }

  //Получаем контент ячейки в зависимости от того шапка таблицы это или обычная ячейка
  getCellContent() {
    return (
      <TextareaAutosize
        spellCheck="false"
        className={this.getClassName()}
        style={
          !!this.props.isHeader ? this.getHeaderStyle() : this.getRegularStyle()
        }
        //Задаем контент
        value={this.state.value}
        onFocus={event => this.onFocus(event)}
        disabled={!!this.props.disabled ? true : false}
        onChange={event => this.onChange(event)}
        //Обрабатываем двойной клик
        onDoubleClick={event => this.showWideEditArea(event)}
        //Обрабатываем контекстное меню
        onContextMenu={event => this.showContextMenu(event)}
        //Обрабатываем потерю фокуса
        onBlur={event => this.onBlur(event)}
        maxRows={1}
        onKeyPress={event => this.onKeyPress(event)}
      />
    );
  }

  //Контекстное меню рисуем только если нужно
  getContextMenu() {
    if (!this.state.contextMenuIsHidden) {
      return (
        <ContextMenu
          scrollLeft={!!this.props.isFixed ? 0 : this.props.scrollLeft}
          scrollTop={!!this.props.isFixed ? 0 : this.props.scrollTop}
          cellStyle={this.props.style}
          setContextMenuHidden={event => this.setContextMenuHidden(event)}
          onChangeStyle={style => this.onChangeStyle(style)}
          onWheel={event => this.setContextMenuHidden(event)}
        />
      );
    }
  }

  //Получим блюр для зоны редактирования
  getWideEditAreaBlur() {
    if (!this.state.wideEditAreaIsHidden) {
      return (
        <WideEditAreaBlur
          onClick={() => {
            this.hideAllEditing();
          }}
          onContextMenu={event => {
            this.showContextMenu(event);
          }}
        />
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.getContextMenu()}
        {this.getCellContent()}
        {this.getWideEditAreaBlur()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    scrollTop: state.scrollTop,
    scrollLeft: state.scrollLeft
  };
};

export default connect(mapStateToProps)(TextContent);