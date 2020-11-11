import {
  FieldPickerSynced,
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  expandRecord,
  TablePickerSynced,
} from "@airtable/blocks/ui";
import React from "react";
import { SprintSummaries } from "./SprintSummaries";
import { FieldSelectors } from "./FieldSelectors";

function Sprint() {
  const base = useBase();

  const globalConfig = useGlobalConfig();
  const tableId = globalConfig.get("selectedTableId");
  const table = base.getTableByIdIfExists(tableId);
  const sprintFieldId = globalConfig.get("sprintFieldId");
  const complexityFieldId = globalConfig.get("complexityFieldId");
  const statusFieldId = globalConfig.get("statusFieldId");
  const ownersFieldId = globalConfig.get("ownersFieldId");
  const taskFieldId = globalConfig.get("taskFieldId");

  const records = useRecords(table);

  return (
    <div>
      {/* Do not show field selectors if they have already been selected. */}
      {tableId &&
      sprintFieldId &&
      complexityFieldId &&
      statusFieldId &&
      ownersFieldId &&
      taskFieldId ? null : (
        <FieldSelectors table={table} />
      )}
      <SprintSummaries
        table={table}
        sprintFieldId={sprintFieldId}
        complexityFieldId={complexityFieldId}
        statusFieldId={statusFieldId}
        ownersFieldId={ownersFieldId}
        taskFieldId={taskFieldId}
      />
    </div>
  );
}

initializeBlock(() => <Sprint />);
