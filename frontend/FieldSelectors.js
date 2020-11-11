import {
  FieldPickerSynced,
  TablePickerSynced,
  globalConfig,
  useGlobalConfig,
} from "@airtable/blocks/ui";
import React from "react";

export function FieldSelectors(props) {
  const { table } = props;

  return (
    <div>
      Select a table:
      <TablePickerSynced globalConfigKey="selectedTableId" />
      Select your sprint field:
      <FieldPickerSynced table={table} globalConfigKey="sprintFieldId" />
      Select your complexity field:
      <FieldPickerSynced table={table} globalConfigKey="complexityFieldId" />
      Select your status field:
      <FieldPickerSynced table={table} globalConfigKey="statusFieldId" />
      Select your owners field:
      <FieldPickerSynced table={table} globalConfigKey="ownersFieldId" />
      Select your task field:
      <FieldPickerSynced table={table} globalConfigKey="taskFieldId" />
    </div>
  );
}
