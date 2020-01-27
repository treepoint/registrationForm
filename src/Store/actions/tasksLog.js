//Обвязка для API
import { APIURL, getHeaders } from "../APIConfiguration";
import Axios from "axios";
import { fetchTasksByDate, setTasks } from "./tasks";
import { getCurrentTimeFormat } from "../../Libs/TimeUtils";

const URL = APIURL + "/tasks_log";

export const SET_TASKS_LOG = "SET_TASKS_LOG";
export const IS_TASKS_LOG_UPDATING = "IS_TASKS_LOG_UPDATING";
export const REMOVE_TASK_LOG = "REMOVE_TASK_LOG";
export const CLEAR_TASKS_LOG = "CLEAR_TASKS_LOG";
export const TASK_LOG_CREATE_ERROR = "TASK_LOG_CREATE_ERROR";
export const TASK_LOG_UPDATE_ERROR = "TASK_LOG_UPDATE_ERROR";
export const TASK_LOG_DELETE_ERROR = "TASK_LOG_DELETE_ERROR";

export function setTasksLog(object) {
  return { type: SET_TASKS_LOG, object };
}

export function setIsUpdating(boolean) {
  return { type: IS_TASKS_LOG_UPDATING, boolean };
}

export function clearTasksLog(object) {
  return { type: CLEAR_TASKS_LOG, object };
}

export function setCreateError(text) {
  return { type: TASK_LOG_CREATE_ERROR, text };
}

export function setUpdateError(text) {
  return { type: TASK_LOG_UPDATE_ERROR, text };
}

export function setDeleteError(text) {
  return { type: TASK_LOG_DELETE_ERROR, text };
}

//Получить весь лог выполнения за определенный период
export function fetchTasksLogByDate(date) {
  return dispatch => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    Axios.get(URL + "/date/" + date, headers).then(response => {
      dispatch(setTasksLog(response.data));
      dispatch(fetchTasksByDate(date));
    });
  };
}

//Создать лог
export function createTaskLog(taskId, date) {
  return dispatch => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    let taskLog = {
      task_id: taskId,
      comment: "",
      execution_start: date + " " + getCurrentTimeFormat(),
      execution_end: date
    };

    Axios.post(URL, taskLog, headers)
      .then(response => {
        if (typeof response.data === "object") {
          //К нему добавим новый объект и обновим список
          dispatch(setTasksLog(response.data));
        }
      })
      .catch(error => {
        dispatch(setCreateError("Не удалось добавить запись в логе"));
      });
  };
}

//Обновить лог
export function updateTaskLog(taskLog, forDate) {
  return (dispatch, getState) => {
    dispatch(setIsUpdating(true));

    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    //При обновлении лога обновляем и время исполнения соответствующей задачи
    const state = getState();

    let oldTaskLog = state.tasksLog[taskLog.id];
    let task = state.tasks[taskLog.task_id];

    let executionTimeDay = task.execution_time_day;
    let executionTimeToDay = task.execution_time_to_day;

    Axios.put(URL + "/" + taskLog.id, taskLog, headers)
      .then(response => {
        if (typeof response.data === "object") {
          //Новое время исполнения за день
          let newExecutionTime =
            response.data[Object.keys(response.data)[0]].execution_time;
          //Получим разницу
          let changeTime = newExecutionTime - oldTaskLog.execution_time;
          //Обновим показатели
          task.execution_time_day = executionTimeDay + changeTime;
          task.execution_time_to_day = executionTimeToDay + changeTime;
          //Соберем таск в требуемый вид
          task = { [taskLog.task_id]: task };
          //Обновим таск
          dispatch(setTasks(task));

          let newTaskLog = response.data;
          //Проставим дату за которую считаем лог
          newTaskLog[Object.keys(newTaskLog)[0]].for_date = forDate;
          //Обновим лог
          dispatch(setTasksLog(newTaskLog));
          dispatch(setIsUpdating(false));
        }
      })
      .catch(error => {
        dispatch(setUpdateError("Не удалось обновить запись в логе"));
        dispatch(setIsUpdating(false));
      });
  };
}

//Удалить лог
export function deleteTaskLog(id) {
  return (dispatch, getState) => {
    let headers = getHeaders();

    if (headers === null) {
      return;
    }

    const state = getState();

    //При удалении лога нужно вычесть его время из задачи
    let taskLog = state.tasksLog[id];
    let task = state.tasks[taskLog.task_id];
    //Получаем время исполнения таска
    let executionTimeDay = task.execution_time_day;
    let executionTimeToDay = task.execution_time_to_day;
    //Вычитаем время выполнения из лога
    task.execution_time_day = executionTimeDay - taskLog.execution_time;
    task.execution_time_to_day = executionTimeToDay - taskLog.execution_time;
    //Соберем таск в требуемый вид
    task = { [taskLog.task_id]: task };

    Axios.delete(URL + "/" + id, headers)
      .then(response => {
        if (typeof response.data.affectedRows === "number") {
          //Обновим таск
          dispatch(setTasks(task));
          //Удалим объект и обновим список
          dispatch(removeTaskLog(id));
        }
      })
      .catch(error => {
        dispatch(setDeleteError("Не удалось удалить запись в логе"));
      });
  };
}

export function removeTaskLog(id) {
  return { type: REMOVE_TASK_LOG, id };
}