import {
  Box,
  FieldPickerSynced,
  Label,
  TablePickerSynced,
  ViewPickerSynced,
} from "@airtable/blocks/ui";
import React from "react";

export function FieldSelectors(props) {
  const { table } = props;

  return (
    <div>
      <Box
        style={{
          margin: "1rem",
        }}
      >
        <Label fontSize="1.2rem">Select a table:</Label>
        <TablePickerSynced globalConfigKey="selectedTableId" />
      </Box>
      {table ? (
        <React.Fragment>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select a view:</Label>
            <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
          </Box>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select your sprint field:</Label>
            <FieldPickerSynced table={table} globalConfigKey="sprintFieldId" />
          </Box>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select your complexity field:</Label>
            <FieldPickerSynced
              table={table}
              globalConfigKey="complexityFieldId"
            />
          </Box>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select your status field:</Label>
            <FieldPickerSynced table={table} globalConfigKey="statusFieldId" />
          </Box>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select your owners field:</Label>
            <FieldPickerSynced table={table} globalConfigKey="ownersFieldId" />
          </Box>
          <Box
            style={{
              margin: "1rem",
            }}
          >
            <Label fontSize="1.2rem">Select your task field:</Label>
            <FieldPickerSynced table={table} globalConfigKey="taskFieldId" />
          </Box>
        </React.Fragment>
      ) : null}
    </div>
  );
}
