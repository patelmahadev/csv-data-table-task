import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Box,
} from "@material-ui/core";
import EditModal from "../components/modal/EditModal";
import { Delete } from "@material-ui/icons";
import DeleteModal from "../components/modal/DeleteModal";
const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  tableContainer: {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "100%",
  },
  tableHead: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "8px",
    fontSize: "13px",
  },
  tableCellHead: {
    border: "1px solid #ddd",
    padding: "8px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  lastColumn: {
    borderRight: "none",
    borderBottom: "none",
    display: "none",
  },
  textError: {
    color: "red",
    display: "flex",
    fontSize: "14px",
  },
  input: {
    padding: "0 20px",
  },
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
});

const CSVDataTable = () => {
  const classes = useStyles();
  const [csvData, setCSVData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [popupColumns, setPopupColumns] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [deletdIndex, setDeletedIndex] = useState();
  const [filterError, setFilterError] = useState("");

  const parseCSV = (csv) => {
    const lines = csv.split("\n");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const row = line.split(",");
      const isRowEmpty = row.every((value) => value.trim() === ""); // Check if all values in the row are empty

      if (!isRowEmpty) {
        data.push(row);
      }
    }

    return data;
  };

  const displayData = (data) => {
    return data.map((rowData, index) => (
      <TableRow key={index}>
        {rowData.map((cellData, index) => (
          <TableCell
            key={index}
            className={
              index === rowData.length - 1
                ? classes.lastColumn
                : classes.tableCell
            }
          >
            {cellData}
          </TableCell>
        ))}
        <TableCell className={classes.tableCell}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpenDeletePopup(rowData[2]);
              setDeletedIndex(index);
            }}
          >
            <Delete />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const deleteRow = (index) => {
    setFilteredData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csv = e.target.result;
        const parsedData = parseCSV(csv);
        setCSVData(parsedData);
      };

      reader.readAsText(file);
    }
  };

  const importCSV = () => {
    setUserInput("");
    setFilteredData(csvData);
  };

  const exportCSV = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const fileNameWithExtension = `file_${randomNum}.csv`;

    const header = Object.keys(filteredData[0]).join(",") + "\n";
    const rows = filteredData.map((rowData) =>
      Object.values(rowData).join(",")
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileNameWithExtension); // Use the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterData = () => {
    if (userInput.length >= 3 || userInput.length === 0) {
      const userInputLower = userInput.toLowerCase().split(",");
      const filtered = csvData.filter((item) => {
        const itemPart = item[0]?.toLowerCase();
        const itemAltPart = item[1]?.toLowerCase();

        const arrayFiltered = userInputLower.some((el) => {
          return itemPart.includes(el) || itemAltPart.includes(el);
        });
        return arrayFiltered;
      });
      setFilteredData(filtered);
      setFilterError("");
    } else {
      setFilterError("User input length must be greater than or equal to 3");
    }
  };

  const openTablePopup = (selectedColumns) => {
    setPopupColumns(selectedColumns);
    setOpenPopup(true);
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  const handleUpdateInventory = () => {
    openTablePopup(["Part", "Alt_Part", "Model", "LocA_Stock", "LocB_Stock"]);
    filteredData?.map((items, index) => {
      setEditedData((prevData) => {
        const updatedRow = {
          ...prevData[index],
          locAStock: items[8],
          locBStock: items[10],
        };
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <div>
          <h1 className="page-title">CSV Data Table</h1>
          <Grid container>
            <Grid item sm={3}>
              <input
                type="file"
                id="csvFileInput"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item sm={3}>
              <Box className="btn-group-end">
                <Button variant="outlined" color="primary" onClick={importCSV}>
                  Import CSV
                </Button>

                <Button variant="contained" color="primary" onClick={exportCSV}>
                  Export CSV
                </Button>
              </Box>
            </Grid>
          </Grid>

          <br />
          <Grid container>
            <Grid item sm={3}>
              <label htmlFor="userInput">User Input :</label>
              <TextField
                id="userInput"
                className={classes.input}
                value={userInput}
                onChange={(e) => {
                  if (
                    e.target.value.length >= 3 ||
                    e.target.value.length === 0
                  ) {
                    setFilterError("");
                  }
                  setUserInput(e.target.value);
                }}
              />
              <p className={classes.textError}>{filterError}</p>
            </Grid>
            <Grid item sm={3}>
              <Box className="btn-group-end">
                <Button variant="outlined" color="primary" onClick={filterData}>
                  Filter
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateInventory}
                >
                  Update Inventory
                </Button>
              </Box>
            </Grid>
          </Grid>

          <br />

          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableCellHead}>Part</TableCell>
                  <TableCell className={classes.tableCellHead}>
                    Alt_Part
                  </TableCell>
                  <TableCell className={classes.tableCellHead}>Name</TableCell>
                  <TableCell className={classes.tableCellHead}>Brand</TableCell>
                  <TableCell className={classes.tableCellHead}>Model</TableCell>
                  <TableCell className={classes.tableCellHead}>
                    Engine
                  </TableCell>
                  <TableCell className={classes.tableCellHead}>Car</TableCell>
                  <TableCell className={classes.tableCellHead}>LocA</TableCell>
                  <TableCell className={classes.tableCellHead}>
                    LocA_Stock
                  </TableCell>
                  <TableCell className={classes.tableCellHead}>LocB</TableCell>
                  <TableCell className={classes.tableCellHead}>
                    LocB_Stock
                  </TableCell>
                  <TableCell className={classes.tableCellHead}>Unit</TableCell>
                  <TableCell className={classes.tableCellHead}>Rate</TableCell>
                  <TableCell className={classes.tableCellHead}>Value</TableCell>
                  <TableCell className={classes.tableCellHead}>
                    Remarks
                  </TableCell>
                  <TableCell className={classes.tableCellHead}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{displayData(filteredData)}</TableBody>
            </Table>
            {filteredData.length <= 0 && (
              <div className={classes.noData}>
                <p>No data available</p>
              </div>
            )}
          </TableContainer>
          <EditModal
            openPopup={openPopup}
            closePopup={closePopup}
            popupColumns={popupColumns}
            filteredData={filteredData}
            editedData={editedData}
            setEditedData={setEditedData}
            setFilteredData={setFilteredData}
          />
          <DeleteModal
            openPopup={openDeletePopup}
            closePopup={() => setOpenDeletePopup(false)}
            deleteRow={() => deleteRow(deletdIndex)}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default CSVDataTable;
