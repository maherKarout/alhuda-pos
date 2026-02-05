import { Button, Divider } from "@mui/material";
import React, { useState } from "react";
import SimpleDialog from ".";
import DateFilter from "../date-filter";
import { Box, IconButton, Tooltip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "react-i18next";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

function DateDialog({
  filter,
  isIcon = false,
}: {
  filter: (start: string, end: string) => void;
  isIcon?: boolean;
}) {
  const { t } = useTranslation("translation");
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const onSubmit = (values: { startDate: string; endDate: string }) => {
    setOpen(false);
    filter(values.startDate, values.endDate);
    setReset(true);
  };
  return (
    <>
      {isIcon ? (
        <Tooltip title={t("filter")} enterDelay={500} placement="top">
          <IconButton
            onClick={() => {
              if (!reset) setOpen(true);
              else {
                filter("", "");
                setReset(false);
              }
            }}
          >
            {reset ? <FilterListOffIcon /> : <FilterListIcon />}
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant={reset ? "outlined" : "contained"}
          endIcon={reset ? <FilterListOffIcon /> : <FilterListIcon />}
          onClick={() => {
            if (!reset) setOpen(true);
            else {
              filter("", "");
              setReset(false);
            }
          }}
        >
          {reset ? t("reset") : t("filter")}
        </Button>
      )}
      <SimpleDialog title={t("filter") ?? ""} open={open} setOpen={setOpen}>
        <Box sx={{ p: 2 }}>
          <Divider />
          <br />
          <DateFilter onSubmit={onSubmit} />
        </Box>
      </SimpleDialog>
    </>
  );
}

export default DateDialog;
