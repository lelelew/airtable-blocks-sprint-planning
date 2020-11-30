import dayjs from "dayjs";

const BATCH_SIZE = 50;
async function applyChanges(changes, table) {
  let i = 0;
  while (i < changes.length) {
    const changeBatch = changes.slice(i, i + BATCH_SIZE);
    // awaiting the update means that next batch won't be updated until the current
    // batch has been fully updated, keeping you under the rate limit
    await table.updateRecordsAsync(changeBatch);
    i += BATCH_SIZE;
  }
}

export async function rebalance(
  table,
  records,
  sprintFieldId,
  complexityFieldId,
  statusFieldId,
) {
  const changes = [];
  let currentSprint = dayjs(records[0].getCellValue(sprintFieldId));
  let runningComplexity = 0;
  for (let record of records) {
    const complexity = record.getCellValue(complexityFieldId) || 1;
    const status = record.getCellValue(statusFieldId).name;
    if (status === "Complete") {
      changes.push({
        id: record.id,
        fields: {
          [sprintFieldId]: currentSprint.toDate(),
        },
      });
    } else if (
      status === "In Progress" ||
      status === "Code Review" ||
      status === "Product Review"
    ) {
      changes.push({
        id: record.id,
        fields: {
          [sprintFieldId]: currentSprint.toDate(),
        },
      });
      runningComplexity += complexity;
    } else {
      if (runningComplexity + complexity > 40) {
        console.log("incrementing sprint");
        currentSprint = currentSprint.add(1, "week");
        runningComplexity = complexity;
        changes.push({
          id: record.id,
          fields: {
            [sprintFieldId]: currentSprint.toDate(),
          },
        });
      } else {
        changes.push({
          id: record.id,
          fields: {
            [sprintFieldId]: currentSprint.toDate(),
          },
        });
        runningComplexity += complexity;
      }
    }
  }
  console.log(changes);
  await applyChanges(changes, table);
}
