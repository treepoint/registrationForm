import React from "react";
//Redux
import { connect } from "react-redux";
import { updateTask, deleteTask } from "../../Store/actions/tasks";
import { createTaskLog } from "../../Store/actions/tasksLog";
//Компоненты
import TextContent from "../TextContent/TextContent";
import SelectContent from "../SelectContent/SelectContent";
import TimeContent from "../TimeContent/TimeContent";
import ConfirmModalWindow from "../ConfirmModalWindow/ConfirmModalWindow";
import Action from "../Action/Action";
//Утилиты
import { getCurrentTimeFormat, getTimeFromMins } from "../../Libs/TimeUtils";
//Картинки
import deleteIcon from "../../Images/icon_delete.png";
import archiveIcon from "../../Images/icon_archive.png";
import dearchiveIcon from "../../Images/icon_dearchive.png";
import timeSpanIcon from "../../Images/icon_time_span.png";
import minimizeIcon from "../../Images/icon_minimize.png";
import maximizedIcon from "../../Images/icon_maximized.png";
//CSS
import "./Task.css";

class Task extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalWindowHidden: true,
      isMinimized: true
    };
  }

  //Изменим вид таска — сделаем большим или маленьким
  changeTaskView() {
    this.setState({ isMinimized: !this.state.isMinimized });
  }

  //Закрыть модальное окно
  closeDeleteModal() {
    this.setState({ isModalWindowHidden: true });
  }

  //Показать модальное окно
  showDeleteModal() {
    this.setState({ isModalWindowHidden: false });
  }

  //Сохраним задачу в ДБ
  saveTaskToDatabase() {
    let task = {
      id: this.props.content.id,
      name: this.props.content.name,
      name_style: this.props.content.name_style,
      status_id: this.props.content.statuses.current,
      category_id: this.props.content.categories.current,
      execution_time_day: this.props.content.execution_time_day,
      execution_time_all: this.props.content.execution_time_all,
      in_archive: this.props.content.in_archive,
      update_date: this.props.date + " " + getCurrentTimeFormat()
    };

    this.props.updateTask(task, this.props.date);
  }

  //Если нужно — перенесем в архив или достанем из архива
  moveToAchrive(value) {
    let task = {
      id: this.props.content.id,
      name: this.props.content.name,
      name_style: this.props.content.name_style,
      status_id: this.props.content.statuses.current,
      category_id: this.props.content.categories.current,
      execution_time_day: this.props.content.execution_time_day,
      execution_time_all: this.props.content.execution_time_all,
      update_date: this.props.date + " " + getCurrentTimeFormat(),
      in_archive: value
    };

    this.props.updateTask(task, this.props.date);
  }

  //Обрабатываем изменение контента
  onChangeName(value) {
    this.setState(
      {
        content: Object.assign(this.props.content, {
          name: value
        })
      },
      this.saveTaskToDatabase()
    );
  }

  //Обрабатываем изменение контента
  onChangeNameStyle(style) {
    this.setState(
      {
        content: Object.assign(this.props.content, {
          name_style: style
        })
      },
      this.saveTaskToDatabase()
    );
  }

  //Обрабатываем изменение контента
  onChangeStatus(status) {
    this.setState(
      {
        content: Object.assign(this.props.content, {
          statuses: {
            current: status.current,
            list: this.props.content.statuses.list
          }
        })
      },
      this.saveTaskToDatabase()
    );
  }

  //Обрабатываем изменение контента
  onChangeCategory(category) {
    this.setState(
      {
        content: Object.assign(this.props.content, {
          categories: {
            current: category.current,
            list: this.props.content.categories.list
          }
        })
      },
      this.saveTaskToDatabase()
    );
  }

  getTaskName() {
    return (
      <div className="textField">
        <TextContent
          value={this.props.content.name}
          width={226}
          height={68}
          isStylable={true}
          //Стиль оформления контента
          bold={this.props.content.name_style.bold}
          italic={this.props.content.name_style.italic}
          backgroundColor={this.props.content.name_style.backgroundColor}
          //Функции
          onChangeStyle={style => {
            this.onChangeNameStyle(style);
          }}
          onChangeValue={value => this.onChangeName(value)}
        />
      </div>
    );
  }

  getStatusSelect() {
    return (
      <div
        className={
          !!this.state.isMinimized ? "selectField" : "selectField full"
        }
      >
        <SelectContent
          isMinimized={this.state.isMinimized}
          value={this.props.content.statuses}
          height={34}
          onChangeValue={value => this.onChangeStatus(value)}
        />
      </div>
    );
  }

  getCategorySelect() {
    return (
      <div
        className={
          !!this.state.isMinimized ? "selectField" : "selectField full"
        }
      >
        <SelectContent
          isMinimized={this.state.isMinimized}
          value={this.props.content.categories}
          height={34}
          onChangeValue={value => this.onChangeCategory(value)}
        />
      </div>
    );
  }

  getExecutionTimeDay() {
    return (
      <div className="timeField">
        <div
          className={
            !!this.state.isMinimized ? "timeLabel hidden" : "timeLabel"
          }
        >
          За день:
        </div>
        <TimeContent
          disabled={true}
          isStandalone={true}
          value={getTimeFromMins(this.props.content.execution_time_day)}
          width={50}
          height={34}
        />
      </div>
    );
  }

  getExecutionTimeAll() {
    return (
      <div
        className={!!this.state.isMinimized ? "timeField hidden" : "timeField"}
      >
        <div className="timeLabel">Всего: </div>
        <TimeContent
          disabled={true}
          isStandalone={true}
          value={getTimeFromMins(this.props.content.execution_time_all)}
          width={50}
          height={34}
        />
      </div>
    );
  }

  getActions() {
    return (
      <div className="taskActions">
        {!!this.props.content.in_archive ? null : (
          <Action
            icon={timeSpanIcon}
            onClick={() =>
              this.props.createTaskLog(this.props.content.id, this.props.date)
            }
          />
        )}

        {!!this.props.content.in_archive ? (
          <React.Fragment>
            <Action
              icon={dearchiveIcon}
              onClick={() => this.moveToAchrive(0)}
            />
            <Action icon={deleteIcon} onClick={() => this.showDeleteModal()} />
          </React.Fragment>
        ) : (
          <Action icon={archiveIcon} onClick={() => this.moveToAchrive(1)} />
        )}
        <Action
          icon={!!this.state.isMinimized ? maximizedIcon : minimizeIcon}
          onClick={() => this.changeTaskView()}
        />
      </div>
    );
  }

  getOptionalPart() {
    if (this.state.isMinimized) {
      return (
        <div className="optionalPart">
          {this.getStatusSelect()}
          {this.getCategorySelect()}
          <div className="executionTime">{this.getExecutionTimeDay()}</div>
          {this.getActions()}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className="optionalPart full">
            {this.getStatusSelect()}
            {this.getCategorySelect()}
            <div className="executionTime">
              {this.getExecutionTimeDay()}
              {this.getExecutionTimeAll()}
            </div>
          </div>
          {this.getActions()}
        </React.Fragment>
      );
    }
  }

  getDeleteModalWindow() {
    if (!this.state.isModalWindowHidden) {
      return (
        <ConfirmModalWindow
          title="Удалить задачу?"
          message="Вместе с задачей будут удалены все записи из лога и статистики. 
Если вы хотите закрыть задачу — проставьте у неё статус с типом «Окончательный»."
          onCancel={() => this.closeDeleteModal()}
          onConfirm={() => this.props.deleteTask(this.props.content.id)}
        />
      );
    }
  }

  render() {
    return (
      <div className="task">
        {this.getDeleteModalWindow()}
        {this.getTaskName()}
        {this.getOptionalPart()}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTask: (task, forDate) => {
      dispatch(updateTask(task, forDate));
    },
    deleteTask: id => {
      dispatch(deleteTask(id));
    },
    createTaskLog: (taskId, date) => {
      dispatch(createTaskLog(taskId, date));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Task);
