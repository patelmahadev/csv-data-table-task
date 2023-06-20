import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({});
const DeleteModal = ({ openPopup, closePopup, deleteRow }) => {
  const classes = useStyles();
  return (
    <Dialog open={openPopup} onClose={closePopup} className="custom-modal">
      <DialogTitle className="modal-title">Delete Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to delete{" "}
        <span style={{ fontWeight: "bold" }}>{openPopup}</span>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closePopup();
          }}
          color="primary"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            deleteRow();
            closePopup();
          }}
          variant="contained"
          className="btn-red"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteModal;
