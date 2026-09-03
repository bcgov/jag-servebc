import { useSelector } from "react-redux";

import React, { useEffect } from "react";

import { timeFormatter } from "../helper/helper";

const Filters = (props) => {
  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    // console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);

  // Used to temporarily store the from and to dates when selecting a date range filter
  let fromTrimmedDate = "";
  let toTrimmedDate = "";

  const renderContent = (param, label, index) => {
    return (
      <div key={index} className="filters m-1 p-1">
        {param.label} : {label}
        <span
          onClick={() => {
            props.handleDeleteFilter(index);
          }}
        >
          <i className="fa fa-solid fa-close p-2"></i>
        </span>
      </div>
    );
  };

  const filters = filterSearchSelections.map((x, index) => {
    if (x.key === "processDefinitionName") {
      return false;
    }
    // Format the display of the responsibility filters correctly
    if (x.value === "Inprogress" || x.value === "In progress") {
      return renderContent(x, "In Progress", index);
    } else if (x.value === "bcps") {
      return renderContent(x, "BCPS", index);
    } else if (x.value === "lsb") {
      return renderContent(x, "LSB", index);
    } else if (x.value === "joint") {
      return renderContent(x, "JOINT", index);
    } else if (x.value === "unassigned"){
      return renderContent(x, "UNASSIGNED", index);
      // Rendering the Next Appearance/Served Date:
      // Get the "from" date, and store for rendering once the "to" date has been fetched
      // Get the "to" date, and render the dates in a single div
      // Before rendering, format the date correctly
    } else if (x.key === "followUp") {
      if (x.label === "Next Apperance Date (From)") {
        fromTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
      } else {
        toTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
        return (
          <div key={index} className="filters m-1 p-1">
            {"Next Appearance Date: "}
            {timeFormatter(fromTrimmedDate)}
            {" To "}
            {timeFormatter(toTrimmedDate)}
            <span
              onClick={() => {
                props.handleDeleteFilter(index);
              }}
            >
              <i className="fa fa-solid fa-close p-2"></i>
            </span>
          </div>
        );
      }
    } else if (x.key === "due") {
      if (x.label === "Serve Date (From):") {
        fromTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
      } else {
        toTrimmedDate = x.value.substring(0, x.value.indexOf("T"));
        return (
          <div key={index} className="filters m-1 p-1">
            {"Served Date: "}
            {timeFormatter(fromTrimmedDate)}
            {" To "}
            {timeFormatter(toTrimmedDate)}
            <span
              onClick={() => {
                props.handleDeleteFilter(index);
              }}
            >
              <i className="fa fa-solid fa-close p-2"></i>
            </span>
          </div>
        );
      }
      // If the user selected the "Document Type" filter
      // Format the display of the "noticeOfConstitutionalQuestionAndSupportingDocuments" label correctly
    } /*else if (
      x.label === "Document Type" &&
      x.value === "noticeOfConstitutionalQuestionAndSupportingDocuments"
    ) {
      return renderContent(x, "NCQ", index);
      // Display the filter normally
    } */else {
      return renderContent(x, x.value, index);
    }
  });

  return filters;
};

export default Filters;
