import {
  FieldPickerSynced,
  initializeBlock,
  useRecords,
  expandRecord,
  TablePickerSynced,
} from "@airtable/blocks/ui";
import React from "react";

export function SprintSummaries(props) {
  const {
    table,
    sprintFieldId,
    complexityFieldId,
    statusFieldId,
    ownersFieldId,
    taskFieldId,
  } = props;
  const records = useRecords(table);

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

  const sprintNames = Object.keys(summaries);

  return (
    <div>
      {sprintNames.map((sprintName) => {
        const summary = summaries[sprintName];
        const people = summary.people;
        const personNames = Object.keys(people);
        return (
          <div key={sprintName}>
            {/* <pre>{JSON.stringify(summaries, null, 2)}</pre> */}
            <p
              style={{
                padding: "0.5rem",
                background: "rgba(0,0,0,0.1)",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Sprint: {sprintName}
            </p>
            <p
              style={{
                padding: "0.5rem",
              }}
            >
              Tasks: {summary.tasks} Completed: {summary.completed} Complexity:{" "}
              {summary.complexity}
            </p>
            {personNames.map((personName) => {
              const person = people[personName];
              return (
                <div
                  key={personName}
                  style={{
                    padding: "1rem",
                  }}
                >
                  <p
                    style={{
                      padding: "0.5rem",
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    {personName}
                  </p>
                  <p
                    style={{
                      padding: "0.5rem",
                    }}
                  >
                    Tasks: {person.tasks} Completed: {person.completed}{" "}
                    Complexity: {person.complexity}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  // const summarizedRecordsHTML = <pre>{JSON.stringify(summaries, null, 2)}</pre>;

  // const iterate = (obj) => {
  //   Object.keys(obj).forEach((key) => {
  //     console.log(`key: ${key}, value: ${obj[key]}`);
  //     if (typeof obj[key] === "object") {
  //       iterate(obj[key]);
  //     }
  //   });
  // };

  // iterate(summaries);

  // let summaryArray = [];
  // Object.keys(summarizedRecords).forEach(function (key) {
  //   summaryArray.push(summarizedRecords[key]);
  // });

  // console.log(summaryArray);
  // return (
  //   <ul>
  //     {summaryArray.map((item) => (
  //       <div key={item.index} label={item.label} value={item.value} />
  //     ))}
  //   </ul>
  // );

  // const summary = summarizedRecords.map((record, index) => {
  //   return (
  //     <div>
  //       <table>
  //         <thead>
  //           <tr>
  //             <td key={index}>Sprint</td>
  //           </tr>
  //         </thead>
  //         <tbody></tbody>
  //       </table>
  //     </div>
  //   );
  // });

  // {
  //   "9/19": {
  //     tasks: 30,
  //     completed: 90,
  //     points: 100
  //   },
  //   "9/28": {
  //     tasks: 30,
  //     completed: 90,
  //     points: 100
  //   }
  // }

  // return (
  //   <div>
  //     {summarizedRecords}
  //     <table>
  //       <thead>
  //         <tr>
  //           <td>Sprint</td>
  //           <td>Tasks</td>
  //           <td>Points</td>
  //           <td>Completed</td>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           {/* <td>{summaries}</td> */}

  //           <td>{"9/19"}</td>
  //           <td>{30}</td>
  //           <td>{90}</td>
  //           <td>{90}</td>
  //         </tr>
  //         <tr>
  //           <td>{"9/28"}</td>
  //           <td>{30}</td>
  //           <td>{90}</td>
  //           <td>{90}</td>
  //         </tr>
  //         <tr>
  //           <td>{"10/6"}</td>
  //           <td>{30}</td>
  //           <td>{90}</td>
  //           <td>{90}</td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // );
}
