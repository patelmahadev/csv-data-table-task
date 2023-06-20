import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles({
  popupContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  popupTextField: {
    width: 200,
  },
  error: {
    border: "1px solid red",
    borderRadius: "4px",
    padding: "0px 5px",
  },
  textError: {
    color: "red",
    display: "flex",
    justifyContent: "center",
    fontSize: "14px",
    marginBottom: 0,
  },
  tableHead: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    border: "1px solid #ddd",
  },
  tableCellHead: {
    border: "1px solid #ddd",
    fontWeight: "bold",
  },
});
const EditModal = ({
  openPopup,
  closePopup,
  popupColumns,
  filteredData,
  editedData,
  setEditedData,
  setFilteredData,
}) => {
  const classes = useStyles();
  const [formError, setFormError] = useState("");
  const handleFieldChange = (index, field, value) => {
    if (value >= 0) {
      setEditedData((prevData) => {
        const updatedRow = { ...prevData[index], [field]: value };
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    }
  };
  const handleSave = () => {
    let hasUpdatedData = false;

    const updatedData = filteredData.map((rowData, index) => {
      const editedRow = editedData[index];
      if (editedRow) {
        const locAStock = editedRow.locAStock;
        const locBStock = editedRow.locBStock;

        if (locAStock > rowData[8] || locBStock > rowData[10]) {
          hasUpdatedData = true;
        }
        return [
          ...rowData.slice(0, 8),
          locAStock,
          ...rowData.slice(9, 10),
          locBStock,
          ...rowData.slice(11),
        ];
      }

      return rowData;
    });
    if (!hasUpdatedData) {
      setFilteredData(updatedData);
      setEditedData([]);
      closePopup();
      setFormError("");
    } else {
      setFormError("New stock can not be greater than old stock.");
    }
  };
  return (
    <Dialog
      maxWidth="lg"
      open={openPopup}
      onClose={closePopup}
      className="custom-modal"
    >
      <DialogTitle className="modal-title">Inventory Update</DialogTitle>
      <DialogContent>
        <div className={classes.popupContainer}>
          <TableContainer className="modal-table">
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  {popupColumns.map((column) => (
                    <TableCell className={classes.tableCellHead} key={column}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((rowData, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      {rowData[0]}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {rowData[1]}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {rowData[4]}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <TextField
                        className={
                          editedData[index]?.locAStock > rowData[8] &&
                          classes.error
                        }
                        type="number"
                        value={editedData[index]?.locAStock}
                        onChange={(e) =>
                          handleFieldChange(index, "locAStock", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <TextField
                        className={
                          editedData[index]?.locBStock > rowData[10] &&
                          classes.error
                        }
                        type="number"
                        value={editedData[index]?.locBStock}
                        onChange={(e) =>
                          handleFieldChange(index, "locBStock", e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </DialogContent>
      <p className={classes.textError}> {formError} </p>
      <DialogActions>
        <Button
          onClick={() => {
            closePopup();
            setFormError("");
          }}
          color="primary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditModal;
