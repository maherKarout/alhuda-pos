import SimpleDialog from ".";
import { Button, DialogContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import updateIcon from "src/assets/images/update-icon.svg";

type propsType = {
  open: boolean;
  setOpen: Function;
  update: Function;
  isOfflineReady?: boolean;
};

function UpdateDialog({ open, setOpen, update, isOfflineReady = false }: propsType) {
  const { t } = useTranslation("translation");

  const handleUpdate = () => {
    update();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <SimpleDialog
      open={open}
      setOpen={() => {}}
      PaperProps={{
        sx: {
          minWidth: "300px",
          p: 2,
          maxWidth: "400px",
        },
      }}
    >
      <DialogContent>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <img src={updateIcon} alt="Update" style={{ width: "48px", height: "48px" }} />
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            {isOfflineReady ? t("app is ready for offline use") : t("new content are available")}
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {isOfflineReady
              ? t("your app can now work offline")
              : t("do you want to update to get the latest features and improvements")}
          </Typography>
        </Stack>
      </DialogContent>

      <Stack direction="row" justifyContent="space-around" gap={2} sx={{ p: 2 }}>
        {!isOfflineReady && (
          <Button fullWidth variant="contained" onClick={handleUpdate} sx={{ borderRadius: "10px" }}>
            {t("update")}
          </Button>
        )}
        <Button
          fullWidth
          color="inherit"
          variant={isOfflineReady ? "contained" : "outlined"}
          onClick={handleCancel}
          sx={{ borderRadius: "10px" }}
        >
          {isOfflineReady ? t("got it") : t("cancel")}
        </Button>
      </Stack>
    </SimpleDialog>
  );
}

export default UpdateDialog;
