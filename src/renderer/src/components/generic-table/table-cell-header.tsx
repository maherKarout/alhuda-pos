import { IconButton, TableCell, styled, tableCellClasses } from "@mui/material";
import StraightIcon from "@mui/icons-material/Straight";
import React, { useState } from "react";
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey["200"],
    color: theme.palette.grey["600"],
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));
type propsType = {
  header: {
    key: string;
    value: string | React.ReactNode;
    sort?: (type: -1 | 1) => void;
  };
  loading: boolean;
  activeSortKey: string;
  setActive: Function;
};
const TableCellHeader = ({
  header,
  loading,
  activeSortKey,
  setActive,
}: propsType) => {
  const [sort, setSort] = useState<-1 | 1>(1);
  return (
    <>
      <StyledTableCell>
        {header.value}
        {header.sort && (
          <IconButton
            onClick={() => {
              setSort((prev) => (prev === 1 ? -1 : 1));
              header.sort && header?.sort(sort);
              setActive(header.value);
            }}
            size="small"
            disabled={loading}
          >
            <StraightIcon
              fontSize="small"
              sx={{
                transform: sort === 1 ? "rotate(180deg)" : "",
                color: activeSortKey === header.value ? "grey.700" : "grey",
                transition: "all 0.3s",
              }}
            />
          </IconButton>
        )}
      </StyledTableCell>
    </>
  );
};

export default TableCellHeader;
