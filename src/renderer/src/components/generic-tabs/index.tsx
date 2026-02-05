import { Box, Button } from "@mui/material";
import { useState } from "react";
import { borderRadius } from "src/shared/styles";
namespace GenericTabs {
  export type tabsProps = {
    tabs: { label: string; value: string }[];
    onChangeTab: (value: string) => void;
  };
}
function GenericTabs({ tabs, onChangeTab }: GenericTabs.tabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      {tabs.map(({ label, value }) => (
        <Button
          sx={{ borderRadius: `${borderRadius.normal}px` }}
          fullWidth
          variant={activeTab === value ? "contained" : "outlined"}
          onClick={() => {
            onChangeTab(value);
            setActiveTab(value);
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
}

export default GenericTabs;
