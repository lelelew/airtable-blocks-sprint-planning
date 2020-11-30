import {
  FieldPickerSynced,
  initializeBlock,
  useBase,
  useRecords,
  useGlobalConfig,
  expandRecord,
  TablePickerSynced,
  Button,
  Icon,
  Text,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import { SprintSummaries } from "./SprintSummaries";
import { FieldSelectors } from "./FieldSelectors";

function Sprint() {
  const [showSelectors, setShowSelectors] = useState(true);

  const base = useBase();

  const globalConfig = useGlobalConfig();
  const tableId = globalConfig.get("selectedTableId");
  const table = base.getTableByIdIfExists(tableId);
  const viewId = globalConfig.get("selectedViewId");
  const sprintFieldId = globalConfig.get("sprintFieldId");
  const complexityFieldId = globalConfig.get("complexityFieldId");
  const statusFieldId = globalConfig.get("statusFieldId");
  const ownersFieldId = globalConfig.get("ownersFieldId");
  const taskFieldId = globalConfig.get("taskFieldId");

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.25rem 0.75rem",
          borderBottom: "1px solid rgba(0,0,0,0.2)",
        }}
      >
        <Text
          style={{
            fontWeight: 500,
            fontSize: "1.2rem",
          }}
        >
          {showSelectors ? "Configuration" : "Tracker"}
        </Text>
        <Button onClick={() => setShowSelectors(!showSelectors)}>
          <Icon name="cog" />
        </Button>
      </div>
      {showSelectors ? (
        <FieldSelectors table={table} />
      ) : (
        <SprintSummaries
          table={table}
          viewId={viewId}
          sprintFieldId={sprintFieldId}
          complexityFieldId={complexityFieldId}
          statusFieldId={statusFieldId}
          ownersFieldId={ownersFieldId}
          taskFieldId={taskFieldId}
        />
      )}
    </div>
  );
}

initializeBlock(() => <Sprint />);
