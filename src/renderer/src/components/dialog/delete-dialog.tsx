import SimpleDialog from ".";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Stack, Typography } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { Button, DialogActions, DialogTitle } from "@mui/material";
import deleteIcon from "src/assets/images/deleteIcon.png";
import { useTranslation } from "react-i18next";
type propsType = {
  open: boolean;
  setOpen: Function;
  deleteHandler: Function;
};
function DeleteDialog({ open, setOpen, deleteHandler }: propsType) {
  const { t } = useTranslation("translation");
  return (
    <SimpleDialog
      open={open}
      setOpen={setOpen}
      PaperProps={{ sx: { minWidth: "100px", p: 2, maxWidth: "300px" } }}
    >
      <DialogContent>
        <Stack direction="column" justifyContent="center" alignItems="center">
          {/* <DeleteOutlineIcon color="error" sx={{ fontSize: "40px", mb: 3 }} /> */}
          <img src={deleteIcon} alt="" />
          <Typography variant="h4" textAlign="center" mt={2}>
            {t("Are you sure you want to delete this record")}
          </Typography>
        </Stack>
      </DialogContent>

      <Stack direction="row" justifyContent="space-around" gap={2}>
        <Button
          fullWidth
          color="error"
          variant="contained"
          onClick={() => {
            deleteHandler();
          }}
          sx={{ borderRadius: "10px" }}
        >
          {t("delete")}
        </Button>
        <Button
          fullWidth
          color="inherit"
          variant="outlined"
          onClick={() => setOpen(false)}
          sx={{ borderRadius: "10px" }}
        >
          {t("cancel")}
        </Button>
      </Stack>
    </SimpleDialog>
  );
}

export default DeleteDialog;
