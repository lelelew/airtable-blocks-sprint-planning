import { useRecords, Button } from "@airtable/blocks/ui";
import React from "react";
import dayjs from "dayjs";
import { rebalance } from "./rebalance";

export function SprintSummaries(props) {
  const {
    table,
    viewId,
    sprintFieldId,
    complexityFieldId,
    statusFieldId,
    ownersFieldId,
    taskFieldId,
  } = props;

  const view = table.getViewByIdIfExists(viewId);
  const records = useRecords(view);

  if (
    !records ||
    !table ||
    !sprintFieldId ||
    !complexityFieldId ||
    !statusFieldId ||
    !ownersFieldId ||
    !taskFieldId
  ) {
    return null;
  }

  // do sprint summary calculation here

  const summaries = records.reduce((accumulator, record) => {
    const sprint = record.getCellValue(sprintFieldId);
    const complexity = record.getCellValue(complexityFieldId);
    const status = record.getCellValue(statusFieldId);
    const owners = record.getCellValue(ownersFieldId);
    const task = record.getCellValue(taskFieldId);

    // goes through all records and returns summary by sprint as a JSON object
    if (sprint && status) {
      accumulator[sprint] = accumulator[sprint] || {
        tasks: 0,
        complexity: 0,
        completed: 0,
        people: {},
      };
      accumulator[sprint].tasks++;
      accumulator[sprint].complexity += complexity;

      // console.log(task, complexity, status.name);
      if (String(status.name).toLowerCase() === "complete") {
        accumulator[sprint].completed += complexity;
      }

      // add owner to owners object and total points for each person
      if (owners) {
        for (let owner of owners) {
          let person = accumulator[sprint].people[owner.name];
          person = person || {
            tasks: 0,
            complexity: 0,
            completed: 0,
          };
          person.tasks++;
          person.complexity += complexity;
          if (String(status.name).toLowerCase() === "complete") {
            person.completed += complexity;
          }
          accumulator[sprint].people[owner.name] = person;
        }
      }
    }
    return accumulator;
  }, {});

  // sort sprints by date
  const sprintNames = Object.keys(summaries).sort((a, b) => {
    const aDate = new Date(a).getTime();
    const bDate = new Date(b).getTime();
    return aDate === bDate ? 0 : aDate - bDate > 0 ? 1 : -1;
  });

  const rebalanceTasks = async () => {
    try {
      await rebalance(
        table,
        records,
        sprintFieldId,
        complexityFieldId,
        statusFieldId,
      );
    } catch (err) {
      console.error(`Error attempting to rebalance tasks.`);
      console.error(err);
    }
  };

  return (
    <div>
      <Button onClick={rebalanceTasks}>Rebalance</Button>
      {sprintNames.map((sprintName) => {
        const summary = summaries[sprintName];
        const people = summary.people;
        const personNames = Object.keys(people);
        return (
          <div
            key={sprintName}
            style={{
              margin: "2rem 1rem",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                padding: "0.5rem",
                background: "rgba(0,0,0,0.05)",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                {dayjs(sprintName).format("MMMM DD")}
              </span>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    height: "1.5rem",
                    background: "rgba(255, 255, 255 , 1)",
                    margin: "0 0.5rem",
                  }}
                >
                  <div
                    style={{
                      flexGrow: 1,
                      height: "1.5rem",
                      background: "rgb(209,247,196)",
                      width: `${
                        (summary.completed / summary.complexity) * 100
                      }%`,
                      color: "#000",
                      fontWeight: 500,
                      padding: "6px 0px",
                      fontSize: "0.75rem",
                      lineHeight: "0.75rem",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        paddingLeft: "10px",
                      }}
                    >
                      {`${Math.round(
                        (summary.completed / summary.complexity) * 100,
                      )}%`}
                    </span>
                  </div>
                </div>
                {/* <span>{summary.tasks} Stories</span> */}
              </div>
            </div>
            <div
              style={{
                margin: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gridTemplateRows: "auto",
              }}
            >
              <strong>Person</strong>
              <strong># Stories</strong>
              <strong># Completed</strong>
              <strong>Complexity</strong>
            </div>
            {personNames.map((personName) => {
              const person = people[personName];
              return (
                <div
                  key={personName}
                  style={{
                    margin: "0 1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gridTemplateRows: "auto",
                  }}
                >
                  <span>
                    {personName.split(" ")[0].charAt(0)}
                    {personName.split(" ")[1].charAt(0)}
                  </span>
                  <span>{person.tasks}</span>
                  <span>{person.completed}</span>
                  <span>{person.complexity}</span>
                </div>
              );
            })}
            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.2)",
                margin: "0.5rem 1rem",
                paddingTop: "0.25rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gridTemplateRows: "auto",
              }}
            >
              <em>Total</em>
              <em>{summary.tasks}</em>
              <em>{summary.completed}</em>
              <em>{summary.complexity}</em>
            </div>
          </div>
        );
      })}
    </div>
  );
}
