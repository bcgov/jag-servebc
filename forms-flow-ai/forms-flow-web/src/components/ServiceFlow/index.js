import React, {useCallback, useEffect, useRef} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TaskList from './list';
import TaskDetails from './details';
import { setCurrentPage } from '../../actions/bpmActions';
import {
    fetchFilterList,
    fetchProcessDefinitionList,
    fetchServiceTaskList,
    getBPMGroups, getBPMTaskDetail
} from "../../apiManager/services/bpmTaskServices";
import { ALL_TASKS } from "./constants/taskConstants";
import {
    reloadTaskFormSubmission,
    setBPMFilterLoader,
    setBPMTaskDetailLoader,
    setFilterListParams,
    setSelectedBPMFilter, setSelectedTaskID
} from "../../actions/bpmTaskActions";
import SocketIOService from "../../services/SocketIOService";
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {push} from "connected-react-router";

export default React.memo(() => {

  const dispatch= useDispatch();
  const filterList = useSelector(state=> state.bpmTasks.filterList);
  const isFilterLoading = useSelector(state=> state.bpmTasks.isFilterLoading);
  const selectedFilter=useSelector(state=>state.bpmTasks.selectedFilter);
  const selectedFilterId=useSelector(state=>state.bpmTasks.selectedFilter?.id||null);
  const bpmTaskId = useSelector(state => state.bpmTasks.taskId);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  const sortParams = useSelector((state) => state.bpmTasks.filterListSortParams);
  const searchParams = useSelector((state) => state.bpmTasks.filterListSearchParams);
  const listReqParams = useSelector((state) => state.bpmTasks.listReqParams);
  const currentUser = useSelector((state) => state.user?.userDetail?.preferred_username || '');
  const firstResult = useSelector(state=> state.bpmTasks.firstResult);
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  const selectedFilterIdRef=useRef(selectedFilterId);
  const bpmTaskIdRef=useRef(bpmTaskId);
  const reqDataRef=useRef(reqData);
  const firstResultsRef=useRef(firstResult);
  const taskListRef=useRef(taskList);

  useEffect(()=>{
    dispatch(setCurrentPage('task'))
  },[dispatch]);

  useEffect(()=>{
    selectedFilterIdRef.current=selectedFilterId;
    bpmTaskIdRef.current=bpmTaskId;
    reqDataRef.current=reqData;
    firstResultsRef.current=firstResult;
    taskListRef.current=taskList;
  });

  useEffect(()=>{
    const reqParamData={...{sorting:[...sortParams.sorting]},...searchParams};
    if(!isEqual(reqParamData,listReqParams)){
      dispatch(setFilterListParams(cloneDeep(reqParamData)))
    }
  },[searchParams,sortParams,dispatch,listReqParams])

  useEffect(()=>{
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
    // dispatch(fetchUserList());
  },[dispatch]);

  useEffect(()=>{
    if(!isFilterLoading && filterList.length && !selectedFilter){
      let filterSelected;
      if(filterList.length>1){
        filterSelected = filterList.find(filter=> filter.name===ALL_TASKS);
        if(!filterSelected){
          filterSelected=filterList[0];
        }
      }else {
        filterSelected = filterList[0];
      }
      dispatch(setSelectedBPMFilter(filterSelected));
    }
  },[filterList,isFilterLoading,selectedFilter,dispatch]);

  const checkIfTaskIDExistsInList = (list,id)=>{
    return list.some(task=>task.id===id);
  }
  const SocketIOCallback = useCallback((refreshedTaskId, forceReload, isUpdateEvent) => {
      if(forceReload){
        dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current,refreshedTaskId)); //Refreshes the Tasks
        if(bpmTaskIdRef.current && refreshedTaskId===bpmTaskIdRef.current){
          dispatch(setBPMTaskDetailLoader(true));
          dispatch(setSelectedTaskID(null)); // unSelect the Task Selected
          dispatch(push(`/task/`));
        }
      } else{
        if(selectedFilterIdRef.current){
          if(isUpdateEvent){
            /* Check if the taskId exists in the loaded Task List */
            if(checkIfTaskIDExistsInList(taskListRef.current,refreshedTaskId)===true){
              dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current)); //Refreshes the Task
            }
          }else{
            dispatch(fetchServiceTaskList(selectedFilterIdRef.current, firstResultsRef.current, reqDataRef.current)); //Refreshes the Task
          }
        }
        if(bpmTaskIdRef.current && refreshedTaskId===bpmTaskIdRef.current) { //Refreshes task if its selected
          dispatch(getBPMTaskDetail(bpmTaskIdRef.current,(err,resTask)=>{
            // Should dispatch When task claimed user  is not the logged in User
            if(resTask?.assignee!==currentUser){
              dispatch(reloadTaskFormSubmission(true));
            }
          }));
          dispatch(getBPMGroups(bpmTaskIdRef.current));
        }
      }
    }
  ,[dispatch,currentUser]);

  useEffect(()=>{
    if(!SocketIOService.isConnected()){
        SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) => SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent));
    }else{
        SocketIOService.disconnect();
        SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) => SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent));
    }
    return ()=>{
      if(SocketIOService.isConnected())
        SocketIOService.disconnect();
    }
  },[SocketIOCallback,dispatch]);

  return (
    <div className="container" id="main">
      <Switch>
        <Route exact path="/task" component={TaskList} />
        <Route path="/task/:taskId"><TaskDetails/></Route>
        <Route path="/task/:taskId/:notavailable"><Redirect exact to='/404'/></Route>
      </Switch>
    </div>
  )
});