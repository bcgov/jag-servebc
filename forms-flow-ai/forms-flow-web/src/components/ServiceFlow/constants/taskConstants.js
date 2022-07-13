export const sortingList = [
  {sortBy:"created",label:"Modified", sortOrder:" "},
  {sortBy:"priority",label:"Priority", sortOrder:" "},
  {sortBy:"dueDate",label:"Served Date", sortOrder:"desc"},
  {sortBy:"assignee",label:"Edited by", sortOrder:" "},
  {sortBy:"name",label:"Task name", sortOrder:" "},
  {sortBy:"followUpDate",label:"Next Appearance Date", sortOrder:" "},
  {sortBy:"processVariable",label:"Party", sortOrder:" ", 
    "parameters":{
      "variable" : "partyName",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Criminal Matter", sortOrder:" ", 
    "parameters":{
      "variable" : "isCriminal",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Next Appearance Date", sortOrder:" ", 
    "parameters":{
      "variable" : "nextAppearanceDate",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Responsibility", sortOrder:" ", 
    "parameters":{
      "variable" : "staffGroup",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Court/Tribunal File #", sortOrder:" ", 
    "parameters":{
      "variable" : "courtOrTribunalFileNbr",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Served Date old", sortOrder:" ", 
    "parameters":{
      "variable" : "servedDate",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Next AppearanceDateFormat", sortOrder:" ", 
    "parameters":{
      "variable" : "nextAppearanceDateFormat",
      "type" : "Object"
  }},
  {sortBy:"processVariable",label:"Status", sortOrder:" ", 
    "parameters":{
      "variable" : "documentStatus",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Lawyer Name", sortOrder:" ", 
    "parameters":{
      "variable" : "lawyerName",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Registry", sortOrder:" ", 
    "parameters":{
      "variable" : "registry",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Document Type", sortOrder:" ", 
    "parameters":{
      "variable" : "documentType",
      "type" : "String"
  }},
  {sortBy:"processVariable",label:"Served Date ISO", sortOrder:" ", 
    "parameters":{
      "variable" : "serveDateInISOFormat",
      "type" : "String"
  }}
];

export const searchData = [
  {"label": "Task Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Variables", "compares": [">", ">=", "=","!=", "<", "<="]},
  {"label": "Process Definition Name", "compares": ["like", "="], "values": ["processDefinitionNameLike", "processDefinitionName"]},
  {"label": "Assignee", "compares": ["like", "="], "values": ["assigneeLike", "assignee"]},
  {"label":"Candidate Group", "compares": ["="], "values": ["candidateGroup"]},
  {"label":"Candidate User", "compares": ["="], "values": ["candidateUser"]},
  {"label":"Name", "compares": ["like", "="], "values": ["nameLike", "name"]},
  {"label": "Description","compares": ["like", "="], "values": ["descriptionLike", "description"] },
  {"label":"Priority", "compares": ["="], "values": ["priority"]},
  {"label":"Due Date", "compares": ["before", "after"], "values": ["due"]},
  {"label":"Follow up Date", "compares": ["before", "after"], "values": ["followUp"]},
  {"label":"Modified", "compares": ["before", "after"], "values": ["created"]},
]

export const Filter_Search_Types = {
  VARIABLES:"variables",
  STRING:"string",
  DATE:"date",
  NORMAL:"normal"
}


export const FILTER_OPERATOR_TYPES = {
  EQUAL:"=",
  LIKE:"like",
  BEFORE:"before",
  AFTER:"after"
}

//TODO update to further constants
export const FILTER_COMPARE_OPTIONS = {
  [Filter_Search_Types.VARIABLES]:[">", ">=", FILTER_OPERATOR_TYPES.EQUAL ,"!=", "<", "<=",FILTER_OPERATOR_TYPES.LIKE],
  [Filter_Search_Types.DATE]:[FILTER_OPERATOR_TYPES.BEFORE, FILTER_OPERATOR_TYPES.AFTER],
  [Filter_Search_Types.STRING]:[FILTER_OPERATOR_TYPES.EQUAL,FILTER_OPERATOR_TYPES.LIKE],
  [Filter_Search_Types.NORMAL]:[FILTER_OPERATOR_TYPES.EQUAL]
};

export const taskFilters = [
  {label:"Process Variables",key:"processVariables", operator:FILTER_OPERATOR_TYPES.EQUAL, type:Filter_Search_Types.VARIABLES, value:"", name:""},
  {label:"Task Variables", key:"taskVariables",operator:FILTER_OPERATOR_TYPES.EQUAL, type:Filter_Search_Types.VARIABLES, value:"", name:""},
  {label:"Process Definition Name",key:"processDefinitionName", operator:FILTER_OPERATOR_TYPES.LIKE, type:Filter_Search_Types.STRING, value:"" },
  {label:"Assignee",key:"assignee",operator:FILTER_OPERATOR_TYPES.LIKE, type:Filter_Search_Types.STRING,value:"", },
  {label:"Candidate Group",key:"candidateGroup",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Candidate User",key:"candidateUser",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Name",key:"name",operator:FILTER_OPERATOR_TYPES.LIKE,type:Filter_Search_Types.STRING,value:""},
  {label:"Description",key:"description",operator:FILTER_OPERATOR_TYPES.LIKE,type:Filter_Search_Types.STRING, value:""},
  {label:"Priority",key:"priority",operator:FILTER_OPERATOR_TYPES.EQUAL,type:Filter_Search_Types.NORMAL, value:""},
  {label:"Due Date",key:"due",operator:FILTER_OPERATOR_TYPES.BEFORE, type:Filter_Search_Types.DATE, value:""},
  {label:"Follow up Date",key:"followUp",operator:FILTER_OPERATOR_TYPES.BEFORE, type:Filter_Search_Types.DATE, value:""},
  {label:"Modified",key:"created",operator:FILTER_OPERATOR_TYPES.BEFORE,type:Filter_Search_Types.DATE, value:"" },
];

export const ALL_TASKS="All tasks"
export const QUERY_TYPES= {ANY:"ANY",ALL:"ALL"};
export const MAX_RESULTS= 30; //maxResults

export const PARTY_NAME = 'partyName';
export const DOCUMENT_STATUS = 'documentStatus';
export const STAFF_GROUP = 'staffGroup'; 
export const IS_CRIMINAL = 'isCriminal';
export const COURT_OR_TRIBUNAL_FILE_NUMBER = 'courtOrTribunalFileNbr';
export const DATE_SERVED = 'dueDate';
export const NEXT_APPEARANCE_DATE = 'followUpDate';
export const REGISTRY = 'registry';
export const DOCUMENT_TYPE = 'documentType';
export const LAWYER_NAME = 'lawyerName';
export const ASSIGNEE = 'assignee';

// Define list of table headers that need to be displayed
// Order matters, should map to order of table columns left -> right
export const TABLE_HEADERS = [
  {label:'Party',key: PARTY_NAME},
  {label:'Status',key: DOCUMENT_STATUS},
  {label:'Responsibility',key: STAFF_GROUP},
  {label:'Criminal Matter',key: IS_CRIMINAL},
  {label:'Court/Tribunal File #',key: COURT_OR_TRIBUNAL_FILE_NUMBER},
  {label:'Date Served',key: DATE_SERVED},
  {label:'Next Appearance Date',key: NEXT_APPEARANCE_DATE},
  {label:'Registry',key: REGISTRY},
  {label:'Document Type',key: DOCUMENT_TYPE},
  {label:'Lawyer',key: LAWYER_NAME},
  {label:'Edited by',key: ASSIGNEE},
  {label:'View/Edit Form',key:''},
];