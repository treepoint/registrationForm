import React from "react";
import Row from "./Row/Row";
import "./Table.css";

class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      tableWidth: 0,
      //Описание столбцов — ширина и прошлая ширина. Можно считать служебным
      columnsDescription: [],
      tableHeader: [],
      tableBody: [],
      uuid: ""
    };
  }

  componentDidMount() {
    let rowTable = this.isValidTable(this.props.children);
    this.setDescription(rowTable);
  }

  setHeader(table) {
    //Первый элемент — всегда заголовок таблицы. Достанем его
    let tableHeader = table[0];
    if (
      JSON.stringify(tableHeader) !== JSON.stringify(this.state.tableHeader)
    ) {
      this.setState({
        tableHeader
      });
    }
  }

  setBody(table) {
    let tableBody = table.slice(1);
    if (JSON.stringify(tableBody) !== JSON.stringify(this.state.tableBody)) {
      this.setState({
        tableBody
      });
    }
  }

  setDescription(table) {
    //Соберем массив, описывающий столбцы
    let columnsDescription = table[0].map(() => {
      return {
        //Текущая, ну или начальная ширина
        width: 240,
        //И прошлая ширина. По умолчанию всегда 0
        prevWidth: 0
      };
    });

    //Запишем в стейт описание столбцов
    this.setState({
      columnsDescription
    });
  }

  //Изменяем ширину столбцов
  changeColumnWidth(width, column) {
    //Если прилетело это событие, но ширина — ноль. Не отрабатываем. Это бессмысленно и скорее всего меняли высоту
    if (width === 0) {
      return;
    }

    //Скопируем текущий стейт
    let columnsDescription = this.state.columnsDescription;
    //Обновим состояние нужного столбца
    columnsDescription[column] = {
      //Ширину перезапишем
      width:
        columnsDescription[column].width +
        width -
        columnsDescription[column].prevWidth,
      //Заменим прошлую ширину на текущую, которая после этого станет прошлой
      prevWidth: width
    };

    //Обновим состояние
    this.setState({
      columnsDescription
    });
  }

  changeUUID(uuid) {
    this.setState({
      uuid
    });
  }

  //Сбрасываем предыдушие длины как только закончили изменение размеров
  stopChangeDimensions() {
    //Скопируем текущий стейт
    let columnsDescription = this.state.columnsDescription;

    //Сбросим все изменения размеров
    columnsDescription = columnsDescription.map(column => {
      return Object.assign(column, { prevWidth: 0 });
    });

    //Обновим стейт
    this.setState({ columnsDescription, uuid: "" });
  }

  isValidTable(table) {
    if (typeof table !== "object") {
      return [["Ошибка"], ["Передан не массив"]];
    }

    if (table.length === 0) {
      return [["Ошибка"], ["Передан пустой массив"]];
    }

    return table;
  }

  render() {
    let rowTable = this.isValidTable(this.props.children);

    this.setHeader(rowTable);
    this.setBody(rowTable);

    //Соберем шапку для отрисовки
    let tableHeader = (
      <Row
        //Указываем, что это шапка
        isHeader={true}
        //Задаем возможность редактирования контента в ячейках
        isEditable={this.props.headerEditable}
        //Задаем возможность изменения размеров ячеек
        isResizeble={this.props.isResizeble}
        uuid={this.state.uuid}
        //Ширина всей таблицы, ну или ширина каждой строки
        width={this.state.tableWidth}
        //Передадим содержимое столбцов из шапки
        rowsContent={this.state.tableHeader}
        //Так же передадим описание столбцов — ширину и подобное
        columnsDescription={this.state.columnsDescription}
        //И callback'и на обработку изменения ширины столбца
        changeColumnWidth={(width, column) =>
          this.changeColumnWidth(width, column)
        }
        //и остановку изменения
        stopChangeDimensions={() => this.stopChangeDimensions()}
        changeUUID={uuid => this.changeUUID(uuid)}
      />
    );

    //Соберем тушку для отрисовки
    let tableBody = this.state.tableBody.map(row => {
      return (
        <Row
          isEditable={this.props.bodyEditable}
          isResizeble={this.props.isResizeble}
          uuid={this.state.uuid}
          width={this.state.tableWidth}
          rowsContent={row}
          columnsDescription={this.state.columnsDescription}
          changeColumnWidth={(width, column) =>
            this.changeColumnWidth(width, column)
          }
          stopChangeDimensions={() => this.stopChangeDimensions()}
          changeUUID={uuid => this.changeUUID(uuid)}
        />
      );
    });

    return (
      <div className="table">
        {tableHeader}
        {tableBody}
      </div>
    );
  }
}

export default Table;