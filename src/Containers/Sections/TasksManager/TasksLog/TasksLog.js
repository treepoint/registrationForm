import React from "react";
//Подключаем redux
import { connect } from "react-redux";
//Компоненты
import Table from "../../../../Components/Table/Table";
import Action from "../../../../Components/Action/Action";
//API
import {
  updateTaskLog,
  deleteTaskLog
} from "../../../../APIController/APIController";
//Утилиты
import { getTimeFromMins } from "../../../../Libs/TimeUtils";
//Картинки
import arrowUpIcon from "../../../../Images/icon_arrow_up.png";
import arrowDownIcon from "../../../../Images/icon_arrow_down.png";

import "./TaskLog.css";

class TasksLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMinimized: true
    };
  }

  minimizeTaskLog() {
    this.setState({ isMinimized: !this.state.isMinimized });
  }

  //Сохраним изменяемую строку в ДБ
  saveRowToDataBase(taskLog, callback) {
    updateTaskLog(taskLog, ok => {
      if (ok) {
        this.props.getTasksLog(callback);
        this.props.getTasks();
      }
    });
  }

  //Удалим лог по задаче из ДБ
  deleteRowFromDataBase(taskLog) {
    deleteTaskLog(taskLog.id, ok => {
      if (ok) {
        this.props.getTasksLog();
        this.props.getTasks();
      }
    });
  }

  //Соберем таблицу для отображения лога по задачам
  getContent() {
    let content = [
      [
        {
          key: "id",
          type: "hidden",
          disabled: true,
          value: "ID"
        },
        {
          key: "task_id",
          type: "string",
          disabled: true,
          value: "Задача",
          width: 480
        },
        {
          key: "execution_start",
          type: "string",
          disabled: true,
          value: "Старт",
          width: 80
        },
        {
          key: "execution_end",
          type: "string",
          disabled: true,
          value: "Стоп",
          width: 80
        },
        {
          key: "execution_time",
          type: "string",
          disabled: true,
          value: "Время",
          width: 80
        },
        {
          key: "comment",
          type: "string",
          disabled: true,
          value: "Комментарий",
          width: 250
        }
      ]
    ];

    //Соберем список задач. Он одинаковый для каждой записи в логе
    let tasksList = [];
    const tasks = this.props.tasks;
    let tasksForChosenDate = {};

    //Отфильтруем за нужную дату
    for (var ts in tasks) {
      if (tasks[ts].for_date === this.props.date) {
        tasksForChosenDate[tasks[ts].id] = tasks[ts];
      }
    }

    for (var t in tasksForChosenDate) {
      tasksList.push({
        value: tasksForChosenDate[t].id,
        label: tasksForChosenDate[t].name,
        style: tasksForChosenDate[t].name_style
      });
    }

    //После этого пройдемся и соберем все записи таск лога
    this.props.tasksLogList.forEach(tasksLogList => {
      //добавим текущую
      let tasks = {
        list: tasksList,
        current: tasksLogList.task_id
      };

      content.push([
        { key: "id", type: "hidden", value: tasksLogList.id },
        {
          key: "task_id",
          type: "select",
          disabled: false,
          value: tasks
        },
        {
          key: "execution_start",
          type: "time",
          disabled: false,
          value: tasksLogList.execution_start
        },
        {
          key: "execution_end",
          type: "time",
          disabled: false,
          value: tasksLogList.execution_end
        },
        {
          key: "execution_time",
          type: "time",
          disabled: true,
          value: getTimeFromMins(tasksLogList.execution_time)
        },
        {
          key: "comment",
          type: "text",
          disabled: false,
          value: tasksLogList.comment
        }
      ]);
    });

    return content;
  }

  render() {
    return (
      <div className="taskLogTableContainer">
        <div className="taskLogTable">
          <div className="taskLog">
            <div className="taskLogResize">
              <Action
                icon={!!this.state.isMinimized ? arrowUpIcon : arrowDownIcon}
                onClick={() => this.minimizeTaskLog()}
              />
            </div>
            <Table
              maxHeight={!!this.state.isMinimized ? "70px" : "50vh"}
              isFixed={true}
              isEditable={true}
              isResizeble={false}
              saveRow={(row, callback) => this.saveRowToDataBase(row, callback)}
              deleteRow={row => this.deleteRowFromDataBase(row)}
            >
              {this.getContent()}
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks
  };
};

export default connect(mapStateToProps)(TasksLog);
